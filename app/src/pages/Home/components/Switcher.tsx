import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';

export const Switcher = () => {

    const { i18n } = useTranslation();

    const lngs = {
        es: { nativeName: 'Español' },
        en: { nativeName: 'English' },
        fr: { nativeName: 'French' },
        gr: { nativeName: 'German' },
        ch: { nativeName: 'Chinese' }
    } as const;

    const languageOptions = Object.keys(lngs).map((lng) => ({
        value: lng,
        label: lngs[lng as keyof typeof lngs].nativeName,
    }));

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Select
                placeholder="Select language"
                data={languageOptions} // Opciones del dropdown
                value={i18n.resolvedLanguage} // Idioma seleccionado actualmente
                leftSectionPointerEvents="none"
                leftSection={<IconLanguage size="1.25rem" />}
                onChange={(value) => value && i18n.changeLanguage(value)} // Cambiar idioma
                styles={{
                    root: {
                        maxWidth: 150, // Ancho máximo del contenedor
                    },
                    input: {
                        maxWidth: 150, // Ajusta el ancho del campo
                    },
                    label: { fontWeight: 'bold', marginBottom: 5 },
                }}
            />
        </div>
    );
}

export default Switcher;
