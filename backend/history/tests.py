from history.models import User, Device, ControlRelationship

# Get existing user and device
user = User.objects.get(id=1)  # or any other query to get user
device = Device.objects.get(id=1)  # or any other query to get device

# Create relationship
ControlRelationship.objects.create(UserID=user, DeviceID=device)