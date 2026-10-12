import { text } from "stream/consumers";
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,toml,json}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Visby CF", "Poppins", "sans-serif"],
        apercu: ["Apercu", "sans-serif"],
        proximanova: ["'Proxima Nova'", "Helvetica", "Verdana", "sans-serif"],
        copernicus: [
          "'Copernicus Medium'",
          "Georgia",
          '"Times New Roman"',
          "Times",
          "serif",
        ],
        copernicusSemiBold: [
          "'Copernicus Semibold'",
          "Georgia",
          '"Times New Roman"',
          "Times",
          "serif",
        ],
      },
      boxShadow: {
        "sunny-glow":
          "0 0 10px 5px rgba(230, 252, 6, 0.7), 0 0 20px 10px rgba(0, 100, 255, 0.5), 0 0 30px 15px rgba(0, 200, 255, 0.4), 0 0 40px 20px rgba(150, 0, 255, 0.3)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#002b7e",
          foreground: "#fff",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        l3: {
          "20%": {
            "background-position": "0% 0%, 50% 50%, 100% 50%",
          },
          "40%": {
            "background-position": "0% 100%, 50% 0%, 100% 50%",
          },
          "60%": {
            "background-position": "0% 50%, 50% 100%, 100% 0%",
          },
          "80%": {
            "background-position": "0% 50%, 50% 50%, 100% 100%",
          },
        },
      },
      animation: {
        text: "text 5s ease infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        l3: "l3 1s infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
