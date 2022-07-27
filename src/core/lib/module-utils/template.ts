import time from "./time.js";

const PRESETS = {
    time() {
        const t = time();

        const rules: [RegExp, string][] = [
            [/\$time\$/g, `$year$/$month$/$day$ $hour$:$minute$:$second$`],
            [/\$year\$/g, t[0].toString()],
            [/\$month\$/g, t[1].toString()],
            [/\$day\$/g, t[2].toString()],
            [/\$hour\$/g, t[3].toString()],
            [/\$minute\$/g, t[4].toString()],
            [/\$second\$/g, t[5].toString()],
        ];

        return rules;
    },
} as const;

export function template(
    template: string,
    presets: (keyof typeof PRESETS)[] = ["time"],
    custom_rules: [RegExp, string][] = [],
) {
    const rules: [RegExp, string][] = [...custom_rules];
    for (const preset of presets) {
        rules.push(...PRESETS[preset]?.());
    }

    let result = template;
    for (let i = 0; i < rules.length; i++) {
        result = result.replace(rules[i][0], rules[i][1]);
    }

    return result;
}

export default template;
