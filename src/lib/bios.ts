// The words, per profile. One entry per slot a platform gives us, with the
// limit it enforces, so "does this fit" is answered on the page instead of in
// the upload form.
//
// House rules these follow, from the account's published-content doctrine:
// say what the thing is, never ask for business, never praise ourselves, no
// fear hooks. A profile bio may name the product and link it — that is what
// the field is for — but it reads as a description, not a pitch.

export interface Bio {
  platform: string;
  handle: string;
  slot: string;
  limit: number;
  text: string;
}

const LINE = "Agents are just folders.";

export const BIOS: Bio[] = [
  { platform: "X", handle: "@foldrun1", slot: "Bio", limit: 160,
    text: `${LINE} Write them in markdown, check them, run them on a schedule, deploy them. A person approves anything that leaves. foldrun.io` },

  { platform: "LinkedIn", handle: "foldrun", slot: "Tagline", limit: 120,
    text: "Agents are just folders — markdown you can read, running on a schedule, with a person on every gate." },

  { platform: "LinkedIn", handle: "foldrun", slot: "About", limit: 2000,
    text: `foldrun is a platform for running AI agents you can actually read.

An agent is a folder: a markdown file that says what it does, the tools it may use, and the rules it works under. A flow is a numbered list of those agents. There is no graph to drag, no framework to learn, and nothing hidden in a prompt you cannot see.

Push the folder and it runs in the cloud — on a schedule, a webhook, an email, or a button. Every step gets a fresh sandbox. Every run is a record: what it did, what it touched, what it cost. Every run has a budget, and it stops at the cap.

Anything that leaves — a published article, a review reply, an email to a stranger — waits for a person to say yes.

People run it today to publish articles, answer every Google review across their locations, find and contact partners, keep a second brain that files itself, and send themselves a morning brief.

Open format. The core and CLI are Apache-2.0.` },

  { platform: "Facebook", handle: "foldrun", slot: "Short description", limit: 255,
    text: `${LINE} Write them in markdown, run them on a schedule in the cloud, and keep a person on every gate — nothing is published or sent without a yes. Open format, Apache-2.0 core.` },

  { platform: "Instagram", handle: "@foldrun", slot: "Bio", limit: 150,
    text: `${LINE}\nMarkdown in, work out — on a schedule, with a person on every gate.\nfoldrun.io` },

  { platform: "TikTok", handle: "@foldrun1", slot: "Bio", limit: 80,
    text: `${LINE} Markdown that runs itself. foldrun.io` },

  { platform: "YouTube", handle: "@foldrun", slot: "Channel description", limit: 1000,
    text: `${LINE}

foldrun turns a folder of markdown into work that runs on its own — on a schedule, in the cloud, with a person approving anything that leaves. No framework, no graph to drag, nothing hidden in a prompt.

Here we build real ones end to end: publishing, reviews, outreach, a second brain, a morning brief.

foldrun.io` },

  { platform: "Reddit", handle: "u/foldrun", slot: "Profile bio", limit: 200,
    text: "Building foldrun — agents are just folders of markdown you can read, run on a schedule and deploy. Here to learn, not to pitch." },

  { platform: "Subreddit", handle: "r/foldrun", slot: "Community description", limit: 500,
    text: `${LINE} A place to read, run and argue about agents written as plain markdown — flows, tools, schedules, gates, and what breaks when you leave one running. Show what you built and what it cost.` },

  { platform: "Medium", handle: "@foldrun", slot: "Bio", limit: 160,
    text: `${LINE} We write about building agents you can read, run and trust — and what breaks when you leave them running. foldrun.io` },

  { platform: "Substack", handle: "foldrun", slot: "Description", limit: 250,
    text: "Notes from building foldrun: agents as plain markdown folders, running on a schedule, with a person on every gate. What we shipped, what broke, and what we learned leaving agents running in production." },

  { platform: "Indie Hackers", handle: "foldrun", slot: "Product description", limit: 300,
    text: `${LINE} Write an agent as markdown, list them into a flow, push the folder. It runs in the cloud on a schedule, every run is a record with a cost, and a person approves anything that leaves.` },

  { platform: "Product Hunt", handle: "foldrun", slot: "Tagline", limit: 60,
    text: "Agents are just folders of markdown" },

  { platform: "Product Hunt", handle: "foldrun", slot: "Description", limit: 260,
    text: "Write an agent as a markdown file, list a few into a flow, push the folder. It runs in the cloud on a schedule, in a fresh sandbox per step, with a budget and a record — and a person approves anything that gets published or sent." },

  { platform: "dev.to", handle: "@foldrun", slot: "Bio", limit: 200,
    text: `${LINE} Markdown you can read, running on a schedule, with a person on every gate. Core and CLI are Apache-2.0.` },

  { platform: "Quora", handle: "foldrun", slot: "Description", limit: 300,
    text: "Answers about running AI agents in production — written while building foldrun, where an agent is a folder of markdown that runs on a schedule with a person on every gate." },

  { platform: "GitHub", handle: "foldrun-io", slot: "Org description", limit: 160,
    text: `${LINE} Markdown you can read, running on a schedule, with a person on every gate. Core and CLI are Apache-2.0.` },

  { platform: "Eventbrite", handle: "foldrun", slot: "Organiser description", limit: 500,
    text: `${LINE} We run sessions on building agents you can read: write one as markdown, list a few into a flow, push the folder, and keep a person on every gate. Sessions are taught, not sold — you leave with the folder you built.` },
];

export const LINK = "https://foldrun.io";
