// The words, per profile. One entry per slot a platform gives us, with the
// limit it enforces, so "does this fit" is answered on the page instead of in
// the upload form.
//
// The hook is the same everywhere ("building agents has never been this
// simple") and every bio then says the concrete thing that makes it true: an
// agent is a folder, and it asks you before it does anything public. A claim
// with its evidence in the next clause is the only kind that survives a
// reader who has seen a hundred AI bios this week.
//
// House rules these follow, from the account's published-content doctrine:
// never ask for business, never praise ourselves, no fear hooks. A profile bio
// may name the product and link it, which is what the field is for.
//
// No em dashes in this file: the bios are pasted into forms that mangle them,
// and Matt asked for them gone. Commas, colons and full stops instead.

export interface Bio {
  platform: string;
  handle: string;
  slot: string;
  limit: number;
  text: string;
}

export const BIOS: Bio[] = [
  { platform: "X", handle: "@foldrun1", slot: "Bio", limit: 160,
    text: "Building agents has never been this simple. Write one as a markdown file, push the folder, and it runs on a schedule, with you approving anything that leaves." },

  { platform: "LinkedIn", handle: "foldrun", slot: "Tagline", limit: 120,
    text: "Building agents has never been this simple. Write a folder of markdown, and it runs on a schedule." },

  { platform: "LinkedIn", handle: "foldrun", slot: "About", limit: 2000,
    text: `Building agents has never been this simple.

An agent is a folder. A markdown file says what it does, which tools it may use, and the rules it works under. A flow is a numbered list of those agents. No graph to drag, no framework to learn, nothing hidden in a prompt you cannot see. If you can write a note, you can build one.

Push the folder and it runs in the cloud: on a schedule, a webhook, an email, or a button. Every step gets a fresh sandbox. Every run leaves a record of what it did, what it touched and what it cost. Every run has a budget, and it stops at the cap.

And anything that leaves, whether a published article, a reply to a customer or an email to a stranger, waits for a person to say yes.

People run it today to publish articles, answer every Google review across their locations, find and contact partners, keep a second brain that files itself, and send themselves a morning brief.` },

  { platform: "Facebook", handle: "foldrun", slot: "Short description", limit: 255,
    text: "Building agents has never been this simple. Write one as a markdown file, push the folder, and it runs on a schedule in the cloud, with a person approving anything that gets published or sent." },

  { platform: "Instagram", handle: "@foldrun", slot: "Bio", limit: 150,
    text: "Building agents has never been this simple.\nWrite a folder. It runs while you sleep.\nYou approve what leaves.\nfoldrun.io" },

  { platform: "TikTok", handle: "@foldrun1", slot: "Bio", limit: 80,
    text: "Agents are just folders. Write one, it runs itself. foldrun.io" },

  { platform: "YouTube", handle: "@foldrun", slot: "Channel description", limit: 1000,
    text: `Building agents has never been this simple.

An agent is a folder of markdown. Push it, and it runs in the cloud on a schedule, researching, drafting, posting, replying, and stops to ask you before anything leaves.

On this channel we build real ones end to end and leave nothing out: publishing, reviews, outreach, a second brain, a morning brief. What it cost, what broke, and what we would do differently.

foldrun.io` },

  { platform: "Reddit", handle: "u/foldrun", slot: "Profile bio", limit: 200,
    text: "Building foldrun. Agents are just folders of markdown you can read, run on a schedule and deploy. Here to learn, not to pitch." },

  { platform: "Subreddit", handle: "r/foldrun", slot: "Community description", limit: 500,
    text: "Agents are just folders. A place to read, run and argue about agents written as plain markdown: flows, tools, schedules, gates, and what actually breaks when you leave one running overnight. Show what you built, and what it cost." },

  { platform: "Medium", handle: "@foldrun", slot: "Bio", limit: 160,
    text: "Building agents has never been this simple. We write about agents you can read, run and trust, and what breaks when you leave them running. foldrun.io" },

  { platform: "Substack", handle: "foldrun", slot: "Description", limit: 250,
    text: "Building agents has never been this simple, and this is what it is really like. Notes from running agents in production: what we shipped, what broke overnight, what it cost, and the folder you can copy." },

  { platform: "Indie Hackers", handle: "foldrun", slot: "Product description", limit: 300,
    text: "Building agents has never been this simple. Write an agent as a markdown file, list a few into a flow, push the folder. It runs in the cloud on a schedule, every run has a budget and a receipt, and a person approves anything that leaves." },

  { platform: "Product Hunt", handle: "foldrun", slot: "Tagline", limit: 60,
    text: "Build an AI agent by writing a folder" },

  { platform: "Product Hunt", handle: "foldrun", slot: "Description", limit: 260,
    text: "Building agents has never been this simple. An agent is a markdown file; a flow is a numbered list of them. Push the folder and it runs in the cloud on a schedule: fresh sandbox per step, a budget, a receipt, and your approval before anything leaves." },

  { platform: "dev.to", handle: "@foldrun", slot: "Bio", limit: 200,
    text: "Building agents has never been this simple: an agent is a folder of markdown, a flow is a numbered list of them, and it runs on a schedule with a person on every gate." },

  { platform: "Quora", handle: "foldrun", slot: "Description", limit: 300,
    text: "Answers about running AI agents in production, written while building foldrun, where an agent is a folder of markdown that runs on a schedule and asks a person before anything leaves." },

  { platform: "GitHub", handle: "foldrun-io", slot: "Org description", limit: 160,
    text: "Agents are just folders. Markdown you can read, running on a schedule, with a person on every gate." },

  { platform: "Eventbrite", handle: "foldrun", slot: "Organiser description", limit: 500,
    text: "Building agents has never been this simple, and we run the sessions that prove it. Two hours, one folder of markdown, and you leave with an agent that runs on a schedule and asks you before it does anything public. Taught, not sold." },
];

export const LINK = "https://foldrun.io";
