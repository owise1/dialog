# Conversation

A computer you can chat with.  [demo](http://totallynuclear.club/~owise1/convo/)

### What if....

You're on the phone with a computer. Maybe you've called an Airline or FedEx to track a package and the computer says something like "One moment while I look that up. Beep boo bop boo beep boo bop".  Wouldn't it be cool if, instead of waiting, you could strike up a conversation with it.  You could ask it "How's it going?" and it might tell you about it's terrible experience waiting in line at the DMV this morning.

Or you've just picked up your rental car at the Atlanta airport and you ask your phone for directions to the hotel.  What if the lovely voice guiding you there spoke in the vernacular of the locals? Or could offer anecdotes about the places you passed?

### How?

I heard that the way Google Translate can translate text from one language to another is not because Google engineers have discovered the underlying, fundamental building blocks of human language. In fact, the google algorithm has nothing to do with the types of things an academic linguist might study. 

Instead, Google uses sheer brute force.  When you type an English phrase into Google Translate hoping to get Spanish back, their computers search through billions and billions of texts that are in both English and Spanish.  When they find a match for your phrase in an English text, they return its Spanish counterpart.  Super simple if you have a large enough database and fast enough computers. No need to solve the pesky problem of determining how human language actually works or modeling the human mind in computer code.  Just search for a best match.

I'm not sure that anecdote is even true, but I like the sound of it, so this is the same methodology we're going to use to create a computer that you can have a conversation with.

## Design Principles

I'm not 100% sure how this should be designed but here are some thoughts:

* Distributed & Decentralized - It should be easy to run your own conversation server and they should be able to locate each other.  Size should not conern us.
* Path-like structure - A good conversation can take you anywhere, but the vast majority of them are pretty mundane.  I imagine a walk through the forest, where most will stick to the well-worn path, but there is always the possibility for the unexpected.
* Dialogue - One-on-one conversations. There is the computer and you.
* Retain Context - Wherever possible we should retain the location of the conversation, the original source, and context.
* Human Input Only - Algorithms shouldn't be directly adding to the database.  Using algorithms to locate and input human-created conversations is fine.

### Maybe...

* instead of blogging, some people might find it more fun/comfortable to use express themselves via a dialogue
* like a wikipedia editor ruthlessly presiding over her area of expertise, we might have a conversation overlord maintaining all possible answers to "Wait, what?"
