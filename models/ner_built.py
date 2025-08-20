import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from tqdm import tqdm
import json
from collections import defaultdict
import os
import numpy as np

# Set random seeds for reproducibility
torch.manual_seed(42)
np.random.seed(42)

# 1. Data loading and preparation
def load_dataset(path: str):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Filter out samples without entities
    filtered_data = [item for item in data if item['entities']]
    print(f"Loaded {len(data)} samples, keeping {len(filtered_data)} with entities")
    return filtered_data

def prepare_vocab_and_tags(dataset):
    word_freq = defaultdict(int)
    tag_set = set(["O"])
    
    print("\nScanning dataset for entities...")
    entity_counts = defaultdict(int)
    
    for item in dataset:
        for word in item["text"].lower().split():
            word_freq[word] += 1
        
        for entity in item["entities"]:
            label = entity["label"]
            tag_set.add(f"B-{label}")
            tag_set.add(f"I-{label}")
            entity_counts[label] += 1
    
    print(f"Found entity types: {dict(entity_counts)}")
    print(f"Unique tags: {sorted(tag_set)}")
    
    word2idx = {"<PAD>": 0, "<UNK>": 1, **{w: i+2 for i, w in enumerate(word_freq)}}
    tag2idx = {t: i for i, t in enumerate(sorted(tag_set))}
    
    return word2idx, tag2idx

# 2. Dataset and DataLoader
class NERDataset(Dataset):
    def __init__(self, data, word2idx, tag2idx, max_len=50):
        self.data = data
        self.word2idx = word2idx
        self.tag2idx = tag2idx
        self.max_len = max_len

    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        item = self.data[idx]
        text = item["text"].lower().split()
        entities = item["entities"]
        
        # Initialize all tags as 'O'
        tags = ["O"] * len(text)
        
        # Calculate word positions
        word_positions = []
        pos = 0
        for word in text:
            word_positions.append((pos, pos + len(word)))
            pos += len(word) + 1  # +1 for space
        
        # Assign BIO tags
        for entity in entities:
            label = entity["label"]
            start = entity["start"]
            end = entity["end"]
            
            for i, (word_start, word_end) in enumerate(word_positions):
                # Check if word overlaps with entity
                if not (word_end <= start or word_start >= end):
                    if i == 0 or tags[i-1] != f"I-{label}":
                        tags[i] = f"B-{label}"
                    else:
                        tags[i] = f"I-{label}"
        
        # Convert to indices
        text_indices = [self.word2idx.get(word, self.word2idx["<UNK>"]) for word in text[:self.max_len]]
        tag_indices = [self.tag2idx[tag] for tag in tags[:self.max_len]]
        
        return {
            "text": torch.tensor(text_indices, dtype=torch.long),
            "tags": torch.tensor(tag_indices, dtype=torch.long),
            "raw_text": " ".join(text),
            "raw_tags": tags
        }

def collate_fn(batch):
    texts = [item["text"] for item in batch]
    tags = [item["tags"] for item in batch]
    raw_texts = [item["raw_text"] for item in batch]
    raw_tags = [item["raw_tags"] for item in batch]
    
    # Pad sequences
    texts_padded = torch.nn.utils.rnn.pad_sequence(texts, batch_first=True, padding_value=0)
    tags_padded = torch.nn.utils.rnn.pad_sequence(tags, batch_first=True, padding_value=0)
    
    return {
        "text": texts_padded,
        "tags": tags_padded,
        "raw_text": raw_texts,
        "raw_tags": raw_tags
    }

# 3. NER Model
class NERModel(nn.Module):
    def __init__(self, vocab_size, embedding_dim, hidden_dim, tagset_size, dropout=0.3):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.lstm = nn.LSTM(embedding_dim, hidden_dim//2, num_layers=2,
                           bidirectional=True, batch_first=True)
        self.fc = nn.Linear(hidden_dim, tagset_size)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x, tags=None):
        emb = self.dropout(self.embedding(x))
        lstm_out, _ = self.lstm(emb)
        logits = self.fc(self.dropout(lstm_out))
        
        if tags is not None:
            loss_fn = nn.CrossEntropyLoss(ignore_index=0)  # 0 = pad index
            active_loss = tags.view(-1) != 0
            active_logits = logits.view(-1, logits.shape[-1])[active_loss]
            active_labels = tags.view(-1)[active_loss]
            return loss_fn(active_logits, active_labels)
        return torch.argmax(logits, dim=-1)

# 4. Training and evaluation
def train_model(model, train_loader, val_loader, epochs=25):
    optimizer = torch.optim.AdamW(model.parameters(), lr=0.001)
    best_loss = float('inf')
    
    for epoch in range(epochs):
        model.train()
        train_loss = 0
        for batch in tqdm(train_loader, desc=f"Epoch {epoch+1}/{epochs}"):
            optimizer.zero_grad()
            loss = model(batch["text"], batch["tags"])
            loss.backward()
            optimizer.step()
            train_loss += loss.item()
        
        # Validation
        val_loss = evaluate(model, val_loader)
        print(f"Epoch {epoch+1}: Train Loss = {train_loss/len(train_loader):.4f}, Val Loss = {val_loss:.4f}")
        
        # Save best model
        if val_loss < best_loss:
            best_loss = val_loss
            torch.save(model.state_dict(), "models/ner.pth")
            print("Saved new best model")
    
    return model

def evaluate(model, data_loader):
    model.eval()
    total_loss = 0
    with torch.no_grad():
        for batch in data_loader:
            loss = model(batch["text"], batch["tags"])
            total_loss += loss.item()
    return total_loss / len(data_loader)

# 5. Main function
def main():
    os.makedirs("models", exist_ok=True)
    
    # Load and split data
    dataset = load_dataset("data/smart_home_ner_dataset.json")
    train_data, test_data = train_test_split(dataset, test_size=0.2, random_state=42)
    train_data, val_data = train_test_split(train_data, test_size=0.25, random_state=42)
    
    # Create vocabulary
    word2idx, tag2idx = prepare_vocab_and_tags(train_data)
    
    # Save vocabularies
    with open("models/word2idx.json", 'w', encoding='utf-8') as f:
        json.dump(word2idx, f, ensure_ascii=False, indent=2)
    with open("models/tag2idx.json", 'w', encoding='utf-8') as f:
        json.dump(tag2idx, f, ensure_ascii=False, indent=2)
    print("\nVocabulary files saved to models/ directory")
    
    # Create DataLoaders
    train_dataset = NERDataset(train_data, word2idx, tag2idx)
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True, collate_fn=collate_fn)
    val_loader = DataLoader(NERDataset(val_data, word2idx, tag2idx), batch_size=64, collate_fn=collate_fn)
    test_loader = DataLoader(NERDataset(test_data, word2idx, tag2idx), batch_size=64, collate_fn=collate_fn)
    
    # Initialize model
    model = NERModel(len(word2idx), 128, 256, len(tag2idx))
    print("\nModel architecture:")
    print(model)
    
    # Train
    print("\nStarting training...")
    train_model(model, train_loader, val_loader)
    
    # Test
    test_loss = evaluate(model, test_loader)
    print(f"\nFinal Test Loss: {test_loss:.4f}")

if __name__ == "__main__":
    main()