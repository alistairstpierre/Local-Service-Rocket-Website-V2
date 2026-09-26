<!--
  How to write and rewrite posts in src/pages/blog/. This is the editorial standard;
  docs/SITE-STRUCTURE-AND-SEO-GUIDE.md is the technical/IA standard for client sites.
  Synthesised from Animalz (information gain, intro craft), Grow and Convert (pain
  point SEO), BLUF/answer-first writing, and current AI-citation research.
  The Evidence Bank near the bottom is the most important section: it is the list of
  things only we can say. Feed it to any writer or model before they draft.
  Every post in src/pages/blog/ should pass the Ship Test before it goes live.
-->

# Blog framework — how we write

**The thesis in one line:** every post must contain at least one thing that cannot be
found anywhere else on the internet, and that thing should be a number, a name, or a
mistake we made.

## Why the old way stopped working

The standard SEO blog play was to out-comprehensive the top 10 results. That play is dead,
and it's worth understanding exactly why before writing another word.

An AI model can now synthesise a complete, accurate, well-organised answer to "what is local
SEO for plumbers" in about two seconds, drawing from the existing top ten articles. So
"comprehensive" is no longer a differentiator — it's the floor, available free, instantly, to
everyone. Publishing another thorough overview adds nothing to the conversation, and both
Google and the models can tell.

What a model *cannot* do is know that Motha Electric's Google Business Profile said
"electrical installation service" and that changing one field took them from zero to one to
three calls a day. That is **information gain**: new information entering the world. It's the
only durable reason for a page to exist now, and it's the thing an answer engine has to cite a
source for, because it can't synthesise it from anywhere else.

This is unusually good news for us. Most agencies writing about home service marketing have
never run a home service company's account. We have six of them and the numbers to prove it.
Our moat isn't writing skill. It's receipts.

## The framework

### 1. Pick a topic someone would pay to have answered

Not search volume. Buying intent. Following Grow and Convert's pain point model, our topics
should come from three buckets, roughly in this priority order:

| Bucket | What it looks like for us | Example |
| --- | --- | --- |
| **Jobs to be done** | An owner has a problem we solve, described in their words | "why am I not showing up on Google maps" |
| **Comparison** | They're choosing between options | "SEO vs Google Ads for electricians" |
| **Category** | They're shopping for the service itself | "marketing company for plumbers" |

A good sanity check: **would a business owner ask this question out loud on a call with us?**
If it's a question only a marketer would ask, it's the wrong topic. We are not writing for
other agencies.

Avoid pure top-of-funnel ("what is SEO"). It ranks for people who will never hire us, and it's
exactly the content AI answers for free.

### Trade keywords — owners type their trade

Home service owners almost never search "local SEO tips." They search
**"electrician Google ads"**, **"plumber marketing company"**, **"HVAC Local Services Ads"**,
**"how to hire roofers on Facebook"**. The trade word is part of the query. Our blog has to
match that, or we lose to whoever put "electrician" in the title.

**How the site is organised for this:**

| Layer | What it is | Where it lives |
| --- | --- | --- |
| **Trade landing (rank + convert)** | Dedicated page per trade: offer, proof, FAQs, CTA | `/for/{trade}-marketing` from `src/data/trades.ts` |
| **Pillar blog (receipt + lesson)** | One deep post with the real story/numbers, trade-named in the title when the receipt is a trade | `/blog/...` |
| **Trade spin (when worth it)** | Same lesson, rewritten for a second trade with that trade's language + link back to the pillar and the `/for/` page | `/blog/...` |

**Rules for trade-named content:**

1. **Put the trade in the title, H1, or first paragraph** when the receipt belongs to that
   trade. "GBP mistake that kills electrician leads" beats "GBP category mistakes." Owners
   searching their trade will bounce from a generic H1.
2. **Do not clone the same post eighteen times** with find-and-replace trade names. Thin
   variants fail the Ship Test (no new receipt) and look like spam. Prefer one strong pillar
   plus internal links into `/for/electrician-marketing`, `/for/plumber-marketing`, etc.
3. **Spin a second trade post only when you have a real second receipt** — e.g. an LSA post
   rooted in Hooked Up Electric, then later a plumber LSA story if we get one. Same framework,
   different evidence.
4. **Primary SEO targets look like:** `{trade} marketing`, `{trade} Google ads`,
   `{trade} Local Services Ads`, `{trade} Google Business Profile`, `hire {trade}s Facebook`,
   `{trade} SEO agency`. Document the intended primary phrase in the post file header comment.
5. **Always cross-link** the blog post ↔ matching `/for/` landing ↔ relevant case study /
   service page. The landing converts; the blog earns the citation and the long-tail.

**Trades we already have landings for** (keep blog language in sync with these slugs):
electrician, plumber, HVAC, roofing, waterproofing, garage door, pest control, locksmith,
appliance repair, water damage, tree service, landscaping, towing, junk removal, pressure
washing, septic, fencing, painting.

**Queued pillar topics** (write next; each already has receipts in the Evidence Bank or case
studies — do not invent new numbers):

| Priority | Working title | Primary SEO angle | Receipt |
| --- | --- | --- | --- |
| Done | Rewired: big-agency rebuild hurt ads | `/blog/rewired-big-agency-rebuild` | Rewired $60k→$220k+, dozen agencies |
| Done | Hooked Up: LSA for electricians | `/blog/electrician-local-services-ads` | 1→4 counties, 100–200 leads/mo |
| Done | Electrician LSA complete playbook | `/blog/electrician-lsa-playbook` | Lead-magnet process + Hooked Up / Hank’s receipts + Ads Leads migration |
| Done | Hiring: Facebook vs Indeed | `/blog/hiring-electricians-facebook-vs-indeed` | Indeed burn, ~10-day Meta sprint |
| Queued 2026-09-15 | Honest Hank's: stack $500 wins | `blog-queue/posts/honest-hanks-stack-small-wins.astro` | ~$500 LSA first, $25k→$80k |
| Queued 2026-09-22 | Orbit fees = risk cover | `blog-queue/posts/orbit-fees-risk-not-hours.astro` | ~$1.5k + 20% ad spend |
| Queued 2026-09-29 | Max Conversions junk jobs | `blog-queue/posts/max-conversions-junk-jobs.astro` | Bid-strategy failure mode |
| Queued 2026-10-06 | Review velocity vs count | `blog-queue/posts/review-velocity-beats-count.astro` | Dry Duck review pace |
| Queued 2026-10-13 → 2027-02-02 | 17 trade Google-marketing posts | `blog-queue/posts/*-google-marketing.astro` | Trade SEO titles + named case-study spine (no fake trade clients) |

Regenerate trade queue drafts (idempotent skip if slug exists): `npm run blog:generate-trade-queue`.

**Daily shipping:** ready drafts live in `blog-queue/`. GitHub Action
`.github/workflows/publish-blog.yml` runs `0 20 * * *` UTC (08:00 NZ daily), commits
the next due post (`publishAfter <= today`), and Vercel redeploys from `main`. No PAT
or Deploy Hook required. See `blog-queue/README.md`.

### 2. Find the receipt before you write a word

**No receipt, no post.** A receipt is a specific, verifiable, first-hand thing. Pull from the
Evidence Bank below, or go get a new one. It has to be one of:

- A real client outcome with a real number and a real timeframe
- A named client who can be looked up and verified
- A screenshot of something real (a GBP setting, an account, a search result)
- A mistake we made and what it cost
- A price we actually charge
- A specific thing we do differently, described concretely enough to be copied

If the only thing you can offer is a well-organised opinion, the post shouldn't exist. Write
something else.

### 3. Open with the answer, not the runway

Your intro has two readers: **the owner deciding whether to keep scrolling, and the model
deciding whether to cite you.** Both want the same thing — the answer, immediately.

The shape:

1. **Sentence one is the answer.** Self-contained, 20–50 words, states a claim with a specific
   number or name in it. If you copy that sentence alone into ChatGPT and ask "does this answer
   the question in the headline?", the answer must be yes.
2. **Then the hook.** The story, the tension, the reason this is interesting.
3. **Then relevance.** Who this is for, in their language.

Never open with scene-setting, never restate the headline as a question, and never write "in
today's competitive market." If the first paragraph could sit on top of any article on the
internet, delete it and promote the first sentence that says something.

**Bad:** "Local SEO can be confusing for home service business owners. There's a lot of advice
out there, and it's hard to know what to trust."

**Good:** "One wrong dropdown on a Google Business Profile kept a 46-year-old electrical company
invisible for months. Changing it took thirty seconds and produced one to three calls a day
within a week."

### 4. Build the body for skimmers and machines

- **Question-shaped H2s.** Write the subheading as the question an owner would type or ask.
  "How long before SEO actually works?" beats "Timelines."
- **Answer directly under each H2.** First sentence of each section answers its own heading.
  Detail comes after.
- **Short, quotable, specific sentences.** A sentence carrying one clear claim and one number is
  liftable. A sentence with three clauses and a hedge is not.
- **Use the real number every time.** "Roughly $80k in three weeks" not "significant revenue."
  "About a week" not "quickly."
- **Name names.** Named clients are dramatically more credible than "a client we worked with,"
  and they're verifiable, which is the whole point. Get permission, then use it.
- **Show, don't assert.** A screenshot of the wrong category beats three paragraphs about
  category relevance.
- **Link to the proof.** If you mention Rewired, link the Rewired case study. Every unlinked
  client name is a wasted internal link and an unverified claim.

### 5. Close with the argument, not a summary

Don't recap. End on the sharpest version of the point, ideally something an owner could repeat
to their spouse that evening. The layout already adds the booking CTA, so the last line of the
body should be a thought, not a pitch.

### 6. Answer the follow-up questions

Every post ends with 3–5 real FAQs before the CTA. These do three jobs: they catch long-tail
queries, they feed `FAQPage` schema, and each answer is a self-contained 40–80 word chunk that
an answer engine can lift whole. Write the questions an owner actually asks, not keyword
variants of the headline.

## The Ship Test

Score every draft out of 10. **Below 7, it doesn't publish.** Adapted from the information-gain
rubrics used by Animalz and others, with our own weighting toward first-hand proof.

| # | Test | Points |
| --- | --- | --- |
| 1 | Contains at least one real number from our own work | 0–2 |
| 2 | Names at least one real, lookup-able client or company | 0–2 |
| 3 | First sentence answers the headline on its own, with something specific in it | 0–2 |
| 4 | Offers a named idea, sequence, or rule a reader could apply tomorrow | 0–2 |
| 5 | Links to at least two internal proof pages (case study, service, Flight Plan) | 0–1 |
| 6 | Has 3+ FAQs and a visible published/updated date | 0–1 |

A post that scores 10 but has no receipt still fails. Test 1 and 2 are the point; the rest is
craft.

## House style

These are the rules that keep the blog sounding like Alistair and not like a content mill.

- **First person singular for things Alistair did.** "I turned on Google Ads." First person
  plural for how the company works. "We price below day-one agency fees." Never blur the two.
- **Blunt over polished.** "Their SEO company had been billing them for months and never
  looked" is the register. No hype words: crush, explode, dominate, game-changer, secret.
- **Concede the honest thing.** Real credibility comes from saying the inconvenient part out
  loud — that we don't guarantee outcomes, that month two of a new brand goes quiet, that ads
  weren't the hero of the Motha turnaround.
- **No fake authority.** We don't cite "studies show" without a link. If it's our observation
  from six accounts, say that. It's more persuasive anyway.
- **Talk to one owner.** Second person singular, as if across a table. Not "businesses should
  consider."
- **Short paragraphs.** Two to four sentences. This is read on a phone in a truck.
- **Never say "leads" when you mean "booked jobs."** The whole positioning is that lead counts
  are theatre. The vocabulary has to match.

## Evidence Bank

Everything below is real, already on the site, and safe to cite in a post. **Link the source
page whenever you use one.** If you add a client outcome anywhere on the site, add it here too.

| Client | Receipt | Source page |
| --- | --- | --- |
| **Rewired** (Electrical, Des Moines IA) | $60k → $220k+/mo · 5 → 12 crew · 1.5 → 6 booked calls a day · 3+ years · came to us after ~a dozen agencies · best month ~$300k | `/case-studies/rewired` |
| **Honest Hank's** (Electrician, Tampa FL) | $25k → $80k/mo · 1 → 3 techs · 3rd van wrapped · ~8 months · referred by Rewired · started on ~$500 LSA setup, only scaled once that booked work | `/case-studies/honest-hanks` |
| **Dry Duck** (Waterproofing, Iowa) | $0 → ~$200k/mo in 6 months · 5 full-time staff · built from a ~$500 brief · ~$80k in ~3 weeks before ads warmed up · month two went quiet, organic returned month three | `/case-studies/dry-duck` |
| **Hooked Up Electric** (Merkel TX) | 1 → 4 counties · 100–200 Google leads/mo for 2+ years · grew 600% in 2024 (Jason's words) · LSA-led | `/case-studies/hooked-up` |
| **Motha Electric** | 46 years in business · paying an SEO company, no leads · ads with a proven setup also failed · primary category read "electrical installation service" instead of "electrician" · 0 → 1–3 calls/day within about a week · fix was free and took 30 seconds | `/blog/google-category-relevance` |
| **Across the book** | 6 companies scaled · $10M+ in new revenue · 5.0 on Google · Google Partner | `/` |

**Pricing we publish** (keep these in step with `/get-started` and `/flight-plan`): Pre-flight from
$500/mo, website ~$2k, LSA setup ~$500 then ~$25 per booked call we QA. Liftoff ~$1.5k/mo for SEO
and ad management together, branding ~$3k. Orbit ~$1.5k/mo + 20% of ad spend, hiring sprints ~$500
setup and ~$500/mo while live. Month to month, no lock-in.

**Points of view we own** (each is a post or a section in one):

- Accountable ownership of the whole account — one expert responsible for the outcome
  beats a specialist team where diagnosis is nobody’s job. Good multi-person agencies exist;
  they’re rare. Our model turns the usual failure mode on its head.
- Relevance before authority — teach Google what you are before you buy links or write blogs
- Booked jobs over lead theatre
- Cheap proof before expensive scale — LSA, GBP, and site/SEO converting before Search ads
- Fees should scale with the client's results, not front-load a big setup package
- AI-assisted builds aren't slop; lazy briefs are
- No outcome guarantees: markets are unknown until you work them, and owners have to follow through

## Worked example

**Before** (the old opening of `/blog/google-category-relevance`, 33 words of runway):

> Before you pour more budget into local SEO or Google ads, make sure Google actually knows what
> you do. This is the category mistake that quietly killed leads for an electrician we later helped.

Fails Test 2 (client unnamed), Test 3 (no specific claim in sentence one — "make sure Google
knows what you do" is advice, not an answer), and Test 1 (no number).

**After:**

> A single wrong dropdown on a Google Business Profile kept Motha Electric — a 46-year-old
> electrical company — invisible to people searching "electrician." Their primary category said
> "electrical installation service." Changing it took thirty seconds, cost nothing, and produced
> one to three calls a day within about a week.

Scores 2/2/2: real number, named client, answer in sentence one.
