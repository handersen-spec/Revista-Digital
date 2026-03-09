import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-empty-object-type": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-require-imports": "off"
    }
  },
  // Restrict DB imports to API routes only
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    ignores: ["src/app/api/**", "src/lib/**", "scripts/**"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          paths: [
            { name: "@/lib/db", message: "Importe o DB apenas em rotas de API (src/app/api/**)." },
          ],
          patterns: [
            { group: ["lib/db", "src/lib/db", "../lib/db", "../../lib/db", "../../../lib/db"], message: "Importe o DB apenas em rotas de API (src/app/api/**)." },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
