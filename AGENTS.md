<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Recovery AI recommendations run in a server function (src/lib/recovery/recommendation.*) that uses OPENAI_API_KEY if set, else the Lovable AI Gateway; the UI always falls back to mock data on failure — keeps keys server-side and the demo unbreakable.
