import { expect, test } from '@playwright/test'

const artifactId = process.env.E2E_ARTIFACT_ID ?? 'M-0001'

test('homepage opens a public artifact history without keeper controls', async ({
  page,
}) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: /artifacts travel/i }),
  ).toBeVisible()

  await page.locator('#relics a').first().click()
  await expect(page).toHaveURL(/\/archive\//)
  await expect(page.getByText('Artifact ID')).toBeVisible()
  await expect(page.getByText(/only the current keeper/i)).toBeVisible()
  await expect(page.locator('[aria-hidden="true"].aspect-square')).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Seal Your Chapter' }),
  ).toHaveCount(0)
})

test('unknown artifacts render the branded not-found page', async ({ page }) => {
  await page.goto('/archive/DOES-NOT-EXIST')
  await expect(
    page.getByRole('heading', { name: /not in the archive/i }),
  ).toBeVisible()
})

test('printed QR artifact pages retain keeper chapter access', async ({
  page,
}) => {
  await page.goto(`/artifact/${artifactId}`)
  await expect(page.locator('[aria-hidden="true"].aspect-square')).toHaveCount(0)
  await expect(
    page.getByRole('link', { name: 'Seal Your Chapter' }),
  ).toBeVisible()
})

test('invalid chapters preserve the form and show field errors', async ({
  page,
}) => {
  await page.goto(`/log/${artifactId}`)
  await page.getByLabel(/tell the story/i).fill('Too short')
  await page.getByRole('button', { name: /seal this chapter/i }).click()

  await expect(page.getByRole('alert')).toContainText(/correct/i)
  await expect(page.getByText(/at least 20 characters/i)).toBeVisible()
  await expect(page.getByLabel(/tell the story/i)).toHaveValue('Too short')
})

test('valid chapters publish immediately with a public Instagram link', async ({
  page,
}) => {
  test.skip(
    process.env.E2E_ALLOW_WRITES !== 'true',
    'Set E2E_ALLOW_WRITES=true to run the live write smoke test.',
  )

  const marker = Date.now()
  const handle = 'side.stories'
  const story = `Playwright journey ${marker}: this is a public smoke-test chapter.`

  await page.goto(`/log/${artifactId}`)
  await page.getByLabel(/chapter location/i).fill('Automated smoke test')
  await page.getByLabel(/traveler name/i).fill('Playwright Traveler')
  await page.getByLabel(/instagram username/i).fill(`@${handle}`)
  await page.getByLabel(/tell the story/i).fill(story)
  await page.getByRole('button', { name: /seal this chapter/i }).click()

  await expect(page).toHaveURL(new RegExp(`/artifact/${artifactId}$`))
  await expect(page.getByText(story)).toBeVisible()
  await expect(page.getByRole('link', { name: `@${handle}` })).toHaveAttribute(
    'href',
    `https://www.instagram.com/${handle}/`,
  )
})
