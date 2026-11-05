# CutReview — PROJECT_CONTEXT (after Phase 1)

## Stack (fixed)
React 18, Vite, TS strict (no any), HashRouter, TanStack Query, Zustand, CSS Modules + tokens, Supabase (PKCE; anon sign-in for clients), tus-js-client, @vimeo/player, idb. uk (default) + en. Approved: `project_members.permission` ('view'|'comment'|'comment_approve', null for editors).

## Done: Phase 1
Config (vite base from VITE_BASE, '@/'→src), tokens.css (PLACEHOLDER palette, dark default + [data-theme=light]), base.css, i18n, theme, shell, base UI, CI.

## File tree (src)
app/{App,routes,providers,ThemeProvider}.tsx · main.tsx · vite-env.d.ts
styles/{tokens,base}.css
i18n/{index.ts,I18nProvider.tsx,uk.json,en.json}
lib/{safeStorage.ts,scrollLock.ts}
components/{Button,IconButton,Modal,Toast,Spinner,Skeleton,Tooltip,VisuallyHidden,SegmentedControl}/ (X.tsx + X.module.css) · PageLoader.tsx · LanguageSwitcher.tsx · ThemeSwitcher.tsx
features/{landing,auth,dashboard,review,settings,errors}/*Page.tsx (default exports, all placeholders) · features/dev/{PlaceholderPage,ComponentGallery}
test/i18n.test.ts

## Key APIs
- i18n: `useT(): TFunction` (key: MessageKey typed from en.json; params `{x}`; plural leaf = object with `other`, pass `count`). `useLang(): {lang,setLang}`. `translate(lang,key,params)` pure. uk/en key parity enforced at compile time. Storage key `cutreview.lang`.
- Theme: `useTheme(): {preference:'dark'|'light'|'system', resolved, setPreference}`; key `cutreview.theme`.
- Toast: `useToast(): {show,success,error,info,dismiss}`.
- `Button{variant:'primary'|'secondary'|'ghost'|'danger', size:'sm'|'md'|'lg', loading, leftIcon, rightIcon, fullWidth, iconOnly}`; `IconButton{label,icon,tooltip?}`; `Modal{open,onClose,title,footer?,size?,closeOnBackdrop?}` (focus trap stack, `[data-autofocus]`); `Tooltip{content,placement?}`; `Skeleton{width,height,circle}`; `Spinner{size,label?}`; `SegmentedControl<T>`.
- `safeStorage.{get,set,remove}`; `lockScroll(): unlock`.
- Routes: / /login /dashboard /project/:id /r/:token /settings *. ReviewPage is shared (token present ⇒ client).

## Decisions
- ESLint forbids importing `@supabase/supabase-js` outside `src/data/**` and `src/lib/supabase.ts`; forbids dangerouslySetInnerHTML.
- Skip link is a button (hash hrefs would break HashRouter).
- Breakpoints (480/768/1024/1440) are documented in tokens.css; used literally in @media.
- Touch targets via `@media (pointer: coarse)` and `--control-touch`.
- CI: test + build; env from secrets/vars; base defaults to `/<repo>/`.

## Known issues / TODO
- Tokens and fonts are placeholders until Figma values arrive.
- No PNG PWA icons; lint not run in CI.
- features/dev/* is temporary; remove when real pages exist.

## Next: Phase 2
`data/types.ts` (domain types), `data/repository.ts` (DataRepository interface), `localRepository.ts` (idb + seed), `supabaseRepository.ts`, `lib/supabase.ts` (PKCE, anon), `supabase/schema.sql` (tables, constraints, indexes, RLS, RPCs, storage policies, realtime), repository provider + env switch. Adds deps: @supabase/supabase-js, idb.