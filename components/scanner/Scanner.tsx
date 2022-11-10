import type {
  ScannerMode,
  ScannerTask,
  ScannerConfig,
  ScannedResult,
} from 'types';
import { useState, useRef, Suspense } from 'react';
import { ScannerContext } from 'context/ScannerContext';
import ScannerOptions from 'components/scanner/buttons/ScannerOptions';
import { Skeleton } from '@mui/material';

import dynamic from 'next/dynamic';
const ScannerCamera = dynamic(
  () => import('components/scanner/camera/ScannerCamera')
);
const TouchScreen = dynamic(
  () => import('components/scanner/result/TouchScreen')
);

export interface ScannerProps {
  mode?: keyof typeof ScannerMode;
  task?: keyof typeof ScannerTask;
}

export const Scanner: React.FC<ScannerProps> = ({
  mode = 'single',
  task = 'scan',
}) => {
  const scannedResultRef = useRef<ScannedResult[]>([]);
  const [scannerConfig, setScannerConfig] = useState<ScannerConfig>({
    mode,
    task,
  });

  return (
    <ScannerContext.Provider value={scannedResultRef}>
      <Suspense
        fallback={
          <Skeleton
            variant="rectangular"
            sx={{ height: '100%', width: '100%' }}
          />
        }
      >
        <ScannerOptions
          scannerConfig={scannerConfig}
          setScannerConfig={setScannerConfig}
        />
        <ScannerCamera scannerConfig={scannerConfig} />
        <TouchScreen scannerConfig={scannerConfig} />
      </Suspense>
    </ScannerContext.Provider>
  );
};

export default Scanner;
