import { IconButton } from '@mui/material';

import dynamic from 'next/dynamic';
const CancelIcon = dynamic(() => import('@mui/icons-material/Cancel'));

export interface ICancelBtnProps {
  onClick?: () => void;
}

export const CancelBtn: React.FC<ICancelBtnProps> = ({
  onClick = () => console.warn("no onClick handler is given to 'CancelBtn'"),
}) => {
  return (
    <IconButton
      sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: (t) => t.zIndex.drawer + 1,
      }}
      onClick={onClick}
    >
      <CancelIcon sx={{ color: (t) => t.palette.white.main }} />
    </IconButton>
  );
};

export default CancelBtn;
