// Literary quotes for Lumen reading tracker
export interface Quote {
  text: string;
  author: string;
}

export const literaryQuotes: Quote[] = [
  {
    text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    author: "George R.R. Martin"
  },
  {
    text: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.",
    author: "Jane Austen"
  },
  {
    text: "I have always imagined that paradise will be a kind of library.",
    author: "Jorge Luis Borges"
  },
  {
    text: "Reading is to the mind what exercise is to the body.",
    author: "Joseph Addison"
  },
  {
    text: "Books are a uniquely portable magic.",
    author: "Stephen King"
  },
  {
    text: "A book is a dream you hold in your hands.",
    author: "Neil Gaiman"
  },
  {
    text: "Reading is escape, and the opposite of escape; it's a way to make contact with reality after a day of making things up.",
    author: "Nora Ephron"
  },
  {
    text: "The reading of all good books is like conversation with the finest minds of past centuries.",
    author: "René Descartes"
  },
  {
    text: "Once you learn to read, you will be forever free.",
    author: "Frederick Douglass"
  },
  {
    text: "Words have no single fixed meaning; their meaning is altered by use.",
    author: "Paul Auster"
  },
  {
    text: "Reading gives us someplace to go when we have to stay where we are.",
    author: "Mason Cooley"
  },
  {
    text: "A great book should leave you with many experiences, and slightly exhausted at the end.",
    author: "William Styron"
  },
  {
    text: "Literature is the most agreeable way of ignoring life.",
    author: "Fernando Pessoa"
  },
  {
    text: "There is no greater agony than bearing an untold story inside you.",
    author: "Maya Angelou"
  },
  {
    text: "Reading is a conversation. All books talk. But a good book listens as well.",
    author: "Mark Haddon"
  }
];

export const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * literaryQuotes.length);
  return literaryQuotes[randomIndex];
};