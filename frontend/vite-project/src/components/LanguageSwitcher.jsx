/** @format */

import React from "react";
import { useTranslation } from "react-i18next";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

const languages = [
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

export default function LanguageSwitcher({ className = "" }) {
  const { i18n, t } = useTranslation();

  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  const handleChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <GlobeAltIcon className="w-5 h-5 text-gray-600" />
      <select
        value={i18n.language}
        onChange={handleChange}
        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
