begin;

drop policy if exists "Anyone can submit stories" on public.stories;
drop policy if exists "Anyone can view stories" on public.stories;
drop policy if exists "Anyone can view artifacts" on public.artifacts;

revoke insert, update, delete, truncate, references, trigger
on public.artifacts, public.stories
from anon, authenticated;

commit;
