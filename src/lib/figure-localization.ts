import data from "./data/figures-localized.json";
import type { Figure } from "./figures-types";
import type { Lang } from "./i18n";
type Description={role:string;bio:string};
const descriptions:Record<string,Partial<Record<Lang,Description>>>=data;
export function localizedFigure(figure:Figure,lang:Lang):Description {return descriptions[figure.id]?.[lang] ?? {role:figure.role,bio:figure.bio};}
