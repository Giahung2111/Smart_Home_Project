import { faCog, faDoorOpen, faHistory, faHome, faSlidersH, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const MenuItem = [
  {
    key: 'Dashboard',
    icon: <FontAwesomeIcon icon={faHome} />,
    label: `Dashboard`,
    path: '/'
  },
  {
    key: 'Member',
    icon: <FontAwesomeIcon icon={faUsers} />,
    label: `Members`,
    path: '/member'
  },
  {
    key: 'History',
    icon: <FontAwesomeIcon icon={faHistory} />,
    label: `History`,
    path: '/history'
  },
  {
    key: 'Room',
    icon: <FontAwesomeIcon icon={faDoorOpen} />,
    label: `Rooms`,
    path: '/room'
  },
  {
    key: 'Setting',
    icon: <FontAwesomeIcon icon={faCog} />,
    label: `Settings`,
    path: '/setting'
  },
  {
    key: 'Utility',
    icon: <FontAwesomeIcon icon={faSlidersH} />,
    label: `Utilities`,
    path: '/utility'
  },
];
