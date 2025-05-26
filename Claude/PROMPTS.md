# Init task
```
In this project we are using Open AIs API to search the internet at set intervals of time in order to search for local events. The events are categorised as 'music', 'charity', 'sports', or 'other'.
We then check to see if the searched events already exist in our database. The events are only added to our database if they aren't already saved there.

The issue we are having is that the search api isn't consistant in exactly what it returns, for example, one events might be called 'finsbury park festival' and the same events might be called 'finsbury park festival 2025'. In this example, the same event was saved to our database twice. I want you to help me to solve this issue. Don't make any suggestions yet. I will guide you through our task list. 

Start by reading `openai.service.ts`, `event.controller.ts` and `event.service.ts`. 
```

# Brainstorming
```
I want to improve this function by:
- turning the date string into a Date object that can be checked
- Refining the title:string to cut blank space, turn all to lower case and remove any dates from the title.

Can you suggest some further ways to improve the functionality of this function? 
```

```
Let's start with refining the titles using Regex. Can You write a stand alone function with a single event input, the shape of which is defined in `event.model.ts`.
```