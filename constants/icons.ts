// constants/icons.ts
import chart from "@/assets/icons/chart.png";
import check from "@/assets/icons/check.png";
import crown from "@/assets/icons/crown.png";
import clapperboard from "@/assets/icons/clapperboard.png";
import filter from "@/assets/icons/filter.png";
import moon from "@/assets/icons/moon.png";
import plus from "@/assets/icons/plus.png";
import search from "@/assets/icons/search.png";
import share from "@/assets/icons/share.png";
import star from "@/assets/icons/star.png";
import sun from "@/assets/icons/sun.png";
import bookmark from "@/assets/icons/bookmark.png";
import film from "@/assets/icons/film.png"

export const icons = {
    clapperboard,
    bookmark,
    chart,
    search,
    plus,
    check,
    star,
    crown,
    moon,
    sun,
    share,
    filter,
    film
} as const;

export type IconKey = keyof typeof icons;