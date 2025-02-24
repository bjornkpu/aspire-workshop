# .NET Aspire with Angular, React, and Vue

Open the solution at 
```shell
aspire-samples/samples/AspireWithJavaScript/AspireJavaScript.sln
```
While this loads let's explore the solution.

In the `AppHost/Program.cs` we can see that we are hosting one `weatherApi`, and four frontends. `angular`, `react`, `vue`, and `reactvite`.

Since these are not DotNET solutions we have to open them in the file explorer. Here we find them all.
Let's open the React app at `AspireJavaScript.React/src/components/App.js`.

Here we find that the page is using fetch without a base URL.
```js
const weather = await fetch("api/weatherforecast");
```
We can see why in the webpack config.
```js
...
proxy: [
    {
        context: ["/api"],
        target:
            process.env.services__weatherapi__https__0 ||
            process.env.services__weatherapi__http__0,
        pathRewrite: { "^/api": "" },
        secure: false,
    },
],
...
```
It uses a proxy to point to the host and port given by Aspire AppHost through the environment variables (Like you would in a "real" application).

This proxy method is similar for all the frontends.

---

When the solution has loaded we can take a look at the Resources, and we see these five resources. 

The API should open up, and we see that this is the normal web API we are used to from the web api templates.

Let's take a look at the frontends.
Click on the URLs in the resource view.

Try to change something in the `App.js` file, and see that we have hot re-load.