# Prerequisites

1. **Development Environment**  
   Install one of the following IDEs:
    - Visual Studio 2022
    - JetBrains Rider
    - Visual Studio Code (with the C# Dev Kit installed)

2. **.NET 9 SDK**  
   Download and install .NET 9 from the [official site](https://dotnet.microsoft.com/en-us/download), or run the following:
   ```shell
   winget install Microsoft.DotNet.SDK.9
   ```

3. **Aspire Templates**  
   Install Aspire Project Templates:
   ```shell
   dotnet new install Aspire.ProjectTemplates
   ```

4. **Containerization**  
   Use [Podman](https://podman.io/) (Docker is not allowed at Tietoevry without a licence).

5. **API Testing Tool** _(Optional)_  
   Install [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) as needed.