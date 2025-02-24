# Explore the application

Go to the Weather page in the web component.
See that we can refresh this, but the values only updates every ~5 seconds.

Let's explore why this happens.

## The Traces
On the Traces page in the Aspire Dashboard we can filter on `/weather` and see all the requests that are coming in.

We see that some are hitting the `apiservice` and some are not.

Let's drill down in a trace that hits the `apiService`.

Here we see a waterfall view where we can infer what is happening.
- The `webfrontend` does a `GET` request to the `cache`.
  - There is a cache-miss
- The `webfrontend` then does a `GET` request to the `apiservice`
  - The `apiservice` returns
- The `webfrontend` does a `SETEX` request to the `cache`

---

Now lets take a look at one of the other traces that did not hit the `apiservice`.

We see that this does a `GET`request to the `cache`, and immediately returns. We got a cache-hit.

if we go to the web page file: 
```shell
AspireSample.Web/Components/Pages/Weather.razor
```
We can se why. This page is output cached in Redis for a duration of 5 seconds.
```csharp
@attribute [OutputCache(Duration = 5)]
```