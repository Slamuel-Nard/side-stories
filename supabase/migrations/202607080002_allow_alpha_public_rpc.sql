begin;

grant execute on function public.submit_alpha_story(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text
) to anon, authenticated;

commit;
