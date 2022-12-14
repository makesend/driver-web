import type { SelectChangeEvent } from '@mui/material';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { languages } from 'utils/constants/locales';
import { Box, Divider, Typography } from '@mui/material';

import dynamic from 'next/dynamic';
const Image = dynamic(() => import('components/common/StyledImage'));
const Select = dynamic(() => import('@mui/material/Select'));
const MenuItem = dynamic(() => import('@mui/material/MenuItem'));

const langs = Object.values(languages);

export const Settings: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('settings');
  const [lang, setLang] = useState<string>(router.locale ?? 'en');

  const onChange = useCallback(
    (e: SelectChangeEvent<unknown>) => {
      const locale = e.target.value as string;
      setLang(locale);
      router.replace('/settings', router.asPath, { locale });
    },
    [router]
  );

  return (
    <Box width="100%" height="100%">
      <Typography variant="h1" marginBottom="2rem">
        {t('title.selectLanguage')}
      </Typography>
      <Select
        value={lang}
        size="small"
        labelId="select_a_language"
        onChange={onChange}
        fullWidth
      >
        {langs.map(({ id, title, flag }) => (
          <MenuItem key={id} value={id}>
            <Typography
              sx={{
                textAlign: 'start',
                display: 'inline-flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Image
                src={`https://flagcdn.com/w20/${flag.toLowerCase()}.png`}
                alt={`${id}_flag`}
                layout="fixed"
                width="20px"
                height="15px"
              />
              <Typography component="span" sx={{ ml: '10px' }}>
                {title}
              </Typography>
            </Typography>
          </MenuItem>
        ))}
      </Select>
      <Divider />
    </Box>
  );
};

export default Settings;
