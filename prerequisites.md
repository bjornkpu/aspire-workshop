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

5. **Node - at least version 20.7.0**  
   Download and install Node from the [official site](https://nodejs.org/en), or run the following:
   ```shell
   nvm install latest # use lts if you want v22.x instead of v23.x
   ```
   ::: info
   To install nvm for windows you need to install the `nvm-setup.exe` from the [official release](https://github.com/coreybutler/nvm-windows/releases) (under Assets, not the Antivirus Report).
   :::

6. **API Testing Tool** _(Optional)_  
   Install [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) as needed.

---

I am using:
- JetBrains Rider 2024.3.5
- .NET 9.0.200
- Podman Desktop 1.16.2
- Podman 5.3.2
- NVM 1.2.2
- Node v23.8.0
- Insomnia 10.3.1