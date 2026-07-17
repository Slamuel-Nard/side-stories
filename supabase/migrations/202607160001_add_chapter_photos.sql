begin;

alter table public.stories
  add column if not exists photo_path text;

alter table public.alpha_stories
  add column if not exists photo_path text;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'chapter-photos',
  'chapter-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

revoke insert, update, delete
on storage.objects
from anon, authenticated;

drop function if exists public.submit_story(
  text, text, text, text, text, text, text, text
);

drop function if exists public.submit_story(
  text, text, text, text, text, text, text, text, text
);

create function public.submit_story(
  p_artifact_id text,
  p_event text,
  p_fingerprint text,
  p_instagram_handle text,
  p_message_to_future_holders text,
  p_next_destination text,
  p_photo_path text,
  p_story text,
  p_traveler_name text
)
returns text
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  current_rate private.submission_rate_limits%rowtype;
begin
  if not exists (
    select 1
    from public.artifacts
    where id = p_artifact_id
  ) then
    return 'artifact_not_found';
  end if;

  if p_photo_path is not null
    and p_photo_path !~ '^standard/[A-Za-z0-9_-]+/[0-9a-f-]{36}\.(jpg|png|webp)$'
  then
    raise exception 'Invalid chapter photo path';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_fingerprint, 0));

  select *
  into current_rate
  from private.submission_rate_limits
  where fingerprint = p_fingerprint
  for update;

  if not found then
    insert into private.submission_rate_limits (
      fingerprint,
      window_started_at,
      accepted_count
    )
    values (p_fingerprint, now(), 1);
  elsif current_rate.window_started_at <= now() - interval '15 minutes' then
    update private.submission_rate_limits
    set
      window_started_at = now(),
      accepted_count = 1
    where fingerprint = p_fingerprint;
  elsif current_rate.accepted_count >= 3 then
    return 'rate_limited';
  else
    update private.submission_rate_limits
    set accepted_count = accepted_count + 1
    where fingerprint = p_fingerprint;
  end if;

  insert into public.stories (
    artifact_id,
    event,
    traveler_name,
    instagram_handle,
    story,
    photo_path,
    next_destination,
    message_to_future_holders
  )
  values (
    p_artifact_id,
    p_event,
    p_traveler_name,
    p_instagram_handle,
    p_story,
    p_photo_path,
    p_next_destination,
    p_message_to_future_holders
  );

  return 'accepted';
end;
$$;

revoke all on function public.submit_story(
  text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;

grant execute on function public.submit_story(
  text, text, text, text, text, text, text, text, text
) to service_role;

drop function if exists public.submit_alpha_story(
  text, text, text, text, text, text, text, text
);

drop function if exists public.submit_alpha_story(
  text, text, text, text, text, text, text, text, text
);

create function public.submit_alpha_story(
  p_artifact_id text,
  p_event text,
  p_fingerprint text,
  p_instagram_handle text,
  p_message_to_future_holders text,
  p_next_destination text,
  p_photo_path text,
  p_story text,
  p_traveler_name text
)
returns text
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  current_rate private.submission_rate_limits%rowtype;
begin
  if p_artifact_id not in ('M-0001', 'A-0001', 'R-0001') then
    return 'artifact_not_found';
  end if;

  if not exists (
    select 1
    from public.artifacts
    where id = p_artifact_id
  ) then
    return 'artifact_not_found';
  end if;

  if p_photo_path is not null
    and p_photo_path !~ '^alpha/[A-Za-z0-9_-]+/[0-9a-f-]{36}\.(jpg|png|webp)$'
  then
    raise exception 'Invalid alpha chapter photo path';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_fingerprint, 0));

  select *
  into current_rate
  from private.submission_rate_limits
  where fingerprint = p_fingerprint
  for update;

  if not found then
    insert into private.submission_rate_limits (
      fingerprint,
      window_started_at,
      accepted_count
    )
    values (p_fingerprint, now(), 1);
  elsif current_rate.window_started_at <= now() - interval '15 minutes' then
    update private.submission_rate_limits
    set
      window_started_at = now(),
      accepted_count = 1
    where fingerprint = p_fingerprint;
  elsif current_rate.accepted_count >= 3 then
    return 'rate_limited';
  else
    update private.submission_rate_limits
    set accepted_count = accepted_count + 1
    where fingerprint = p_fingerprint;
  end if;

  insert into public.alpha_stories (
    artifact_id,
    event,
    traveler_name,
    instagram_handle,
    story,
    photo_path,
    next_destination,
    message_to_future_holders
  )
  values (
    p_artifact_id,
    p_event,
    p_traveler_name,
    p_instagram_handle,
    p_story,
    p_photo_path,
    p_next_destination,
    p_message_to_future_holders
  );

  return 'accepted';
end;
$$;

revoke all on function public.submit_alpha_story(
  text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;

grant execute on function public.submit_alpha_story(
  text, text, text, text, text, text, text, text, text
) to service_role, anon, authenticated;

commit;
