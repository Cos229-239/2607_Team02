# Echiron encouragement engine

Echiron treats encouragement as contextual interpretation, not random praise. The engine remains fully local and deterministic: it uses task metadata, user preferences, locally stored feedback, and a curated principle library. It does not send personal data to a model or network service.

## Library architecture

The library contains 134 operational principles:

- 22 foundational Echiron principles about action, self-trust, return, attention, care, responsibility, rest, stewardship, purpose, and opt-in spiritual language.
- 48 philosophical adaptations from Carl Jung, Alan Watts, Laozi, Zhuangzi, Epictetus, Viktor Frankl, William James, Joseph Campbell, Marcus Aurelius, Aristotle, Carl Rogers, Abraham Maslow, Søren Kierkegaard, Ralph Waldo Emerson, Martin Buber, and Simone Weil.
- 32 behavioral principles from Self-Determination Theory, Motivational Interviewing, cognitive-behavioral psychology, Acceptance and Commitment principles, growth-mindset research, self-efficacy theory, flow research, and hope theory.
- 32 humanistic and compassionate principles from self-compassion psychology, trauma-informed practice, positive psychology, resilience research, Nonviolent Communication, broaden-and-build theory, Alfred Adler, and Erich Fromm.

These entries are practical paraphrases, not quotations or attempts to imitate an author’s voice. A philosophical source is treated as a lens that suggests an agency-preserving response; it is never presented as diagnosis, therapy, proof, or authority over the user.

## Context model

A completion is scored against 16 contexts: learning, work, health, relationships, home, creative work, finances, personal growth, focus, planning, recovery, community, caregiving, transition, courageous action, and general progress.

The classifier weights matches by where they appear:

\[
C_k = 8E_k + \sum_{w \in K_k}(5A_w + 3T_w + 1.5D_w + 0.4P_w)
\]

where \(E\) is an exact category-label match, \(A\) is a category-keyword match, \(T\) is a title match, \(D\) is a detail match, and \(P\) is a profile-goal or role match. The highest score becomes the primary context. A sufficiently strong second score is retained as a secondary context, allowing a task to be both relational and courageous, creative and educational, or health-related and restorative.

## Human signals

The engine derives only signals supported by available evidence:

- high priority, delayed, or long carried;
- first completion today, milestone, return after interruption, or steady practice;
- goal alignment or identity alignment;
- focused, restorative, creative, or learning activity;
- shared benefit, foundation building, or movement under uncertainty.

Each signal has several evidence phrases. This lets Echiron say *why* a completion matters without inventing a feeling, struggle, or biography.

## Principle matching

For each enabled principle \(p\), Echiron computes:

\[
S(p) = C_p + 3.25G_p + 1.4M_p + F_p + A_p + N_p - R_p
\]

where:

- \(C_p\) is primary, secondary, and general-context fit;
- \(G_p\) is the number of matched human signals;
- \(M_p\) is semantic keyword overlap, capped at five matches;
- \(F_p\) is saved and dismissed feedback for the principle and its source;
- \(A_p\) is an explicit pinned-principle preference;
- \(N_p\) is a small novelty bonus plus deterministic tie-breaking;
- \(R_p\) penalizes recently repeated principles and sources.

The selector keeps only candidates within nine points of the best contextual score. It then performs deterministic weighted exploration:

\[
P(p) = \frac{e^{(S(p)-S_{max})/3.4}}{\sum_j e^{(S(j)-S_{max})/3.4}}
\]

This prevents two opposite failures: always returning the same top phrase, or selecting an irrelevant lesson merely to create variety. Identical inputs still produce identical output, while different completions can explore multiple closely fitting principles.

## Composition and repetition control

A message can combine:

- one of 128 context leads;
- a tone-specific principle expression;
- one of 48 evidence clauses;
- an optional principle explanation and practical exercise;
- a tone-specific or planning-style closing;
- one of several natural placements for the preferred name.

The conservative base count—before signal evidence, closings, name placement, primary/secondary context combinations, and deeper practices—is 30,000 valid compositions. A 1,000-generation audit currently produces 986 unique messages while reaching 111 principles and 33 sources across eight representative life contexts.

For recent messages \(m_i\), composition similarity is measured with word-set Jaccard similarity:

\[
J(m,m_i) = \frac{|W_m \cap W_i|}{|W_m \cup W_i|}
\]

Candidate wording receives a penalty of \(11\max_i J(m,m_i)\), and exact recent message IDs receive an additional rejection penalty. Recent IDs are retained locally for 40 messages.

## Guardrails

The engine is designed to distinguish:

- optimism from denial;
- acceptance from passivity;
- discipline from punishment;
- responsibility from self-blame;
- meaning from romanticizing suffering;
- compassion from empty or exaggerated praise.

Spiritual principles remain off by default and require an explicit preference. Generated copy must not diagnose, shame, compare the user with other people, promise guaranteed outcomes, demand a perfect streak, or imply that unsafe conditions should be tolerated. Direct tone changes clarity and pace, not dignity.

## Verification

Run:

```bash
npm run typecheck
npm run lint
npm run test:encouragement
npm run audit:encouragement
```

The test suite verifies inventory integrity, context classification, deterministic generation, “Another” variation, spiritual opt-in, breadth, feedback learning, and prohibited language patterns.

## Primary reading behind the philosophical adaptations

- [International Association for Analytical Psychology: Jung’s collected-work abstracts](https://iaap.org/resources/academic-resources/collected-works-abstracts/volume-9-1-archetypes-collective-unconscious/)
- [Alan Watts Organization](https://alanwatts.org/books-articles)
- [Chinese Text Project: Laozi](https://ctext.org/mawangdui/lao-zi-yi-de-jing)
- [Chinese Text Project: Zhuangzi](https://ctext.org/datawiki.pl?if=en&res=561618)
- [MIT Classics: Epictetus](https://classics.mit.edu/Epictetus/epicench.html)
- [Viktor Frankl Institute: logotherapy and existential analysis](https://www.viktorfranklinstitute.org/about-logotherapy/)
- [Project Gutenberg: William James, *The Principles of Psychology*](https://www.gutenberg.org/files/57628/57628-h/57628-h.htm)
- [Joseph Campbell Foundation: the hero’s journey](https://www.jcf.org/learn/joseph-campbell-heros-journey)
