import type { ParcelMixin } from 'types';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Box, Button, Checkbox } from '@mui/material';
import SelectorFilter from 'components/tasks/selector-filter/SelectorFilter';

import dynamic from 'next/dynamic';
const QrCodeScannerIcon = dynamic(
  () => import('@mui/icons-material/QrCodeScanner')
);

export interface TaskSelectorProps<T> {
  sticky?: boolean;
  disabled?: boolean;
  href?: string;
  parcels?: T[];
  selectedParcels?: string[];
  setSelectedParcels?: React.Dispatch<React.SetStateAction<string[]>>;
  filteredParcels?: T[];
  setFilteredParcels?: React.Dispatch<React.SetStateAction<T[]>>;
}

export const TaskSelector = <T extends ParcelMixin>({
  sticky = false,
  disabled = false,
  href = '/scanner',
  parcels = [],
  selectedParcels = [],
  setSelectedParcels = () =>
    console.warn('no setSelectedParcels given to TaskSelector'),
  filteredParcels = [],
  setFilteredParcels = () =>
    console.warn('no setFilteredParcels given to TaskSelector'),
}: TaskSelectorProps<T>) => {
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const changeSelectAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      const parcelIds = filteredParcels.reduce((list, parcel) => {
        const copy = [...list];
        if (parcel?.shipmentID) {
          copy.push(parcel.shipmentID);
        } else if (parcel?.trackingID) {
          copy.push(parcel.trackingID);
        }
        return copy;
      }, [] as string[]);

      if (checked) {
        setSelectedParcels((val) => [
          ...Array.from(new Set([...val, ...parcelIds])),
        ]);
      } else {
        setSelectedParcels(() =>
          selectedParcels.filter((parcel) => !parcelIds.includes(parcel))
        );
      }

      setSelectAll(checked);
    },
    [filteredParcels, selectedParcels, setSelectedParcels]
  );

  useEffect(() => {
    setSelectAll(selectedParcels.length === parcels.length);
    return () => setSelectAll(false);
  }, [parcels, selectedParcels]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        ...(sticky && {
          position: 'sticky',
          top: 0,
          pt: 3,
          pb: 1,
          zIndex: (theme) => theme.zIndex.drawer,
          bgcolor: (theme) => theme.palette.white.main,
        }),
      }}
    >
      <Checkbox
        checked={selectAll}
        disabled={disabled}
        indeterminate={
          selectedParcels.length > 0 &&
          selectedParcels.length !== parcels.length
        }
        onChange={changeSelectAll}
        sx={{ height: (t) => t.spacing(5) }}
      />
      <SelectorFilter
        disabled={disabled}
        parcels={parcels}
        setter={setFilteredParcels}
        wrapperSx={{ flexGrow: 1 }}
      />
      <Link href={href} passHref>
        <Button
          size="small"
          variant="outlined"
          disabled={disabled}
          sx={{
            minWidth: (theme) => theme.spacing(5),
            height: (theme) => theme.spacing(5),
          }}
        >
          <QrCodeScannerIcon />
        </Button>
      </Link>
    </Box>
  );
};

export default TaskSelector;
