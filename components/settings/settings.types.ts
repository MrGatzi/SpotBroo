export interface Setting {
    label: string;
    value: string;
    options: string[];
}

export interface HeaderSettings {
    header: string;
    settings: Setting[];
}

/* ----------------- Props ----------------- */

export interface SettingsItemProps {
    setting: Setting;
    options: string[];
}