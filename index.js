const { exec, execFile } = require('child_process');
const core = require('@actions/core');
const github = require('@actions/github');
var child_process = require('child_process');

try {
  // `language` input defined in action metadata file
  const cmd = core.getInput('language');
  let choosenlang=cmd.toLocaleLowerCase().trim();
  const path = core.getInput('path');
  let filepath= path;

  if(choosenlang=="java"){
      choosenlang="maven clean install";
  }else if(choosenlang == "angular"){
      choosenlang="npm install";
  }else if( choosenlang=="python"){
      choosenlang="pip install -r requirements.txt";
  }else if( choosenlang=="dotnet"){
      choosenlang=`dotnet build ${filepath} --configuration Release`;
  }
  
  const cvrg = core.getInput('cov');
  let  covr = cvrg.toLocaleLowerCase().trim();
  if(covr=="codecov"){
    exec('npm install --save-dev @angular-devkit/build-angular && npm install karma --save-dev && npm install -g @angular/cli && ng test --code-coverage ',
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
  }else if(covr=="coverlet"){
    exec('dotnet test MySampleWebAppTests1/MySampleWebAppTests1.csproj /p:CollectCoverage=true /p:CoverletOutput=TestResults/ /p:CoverletOutputFormat=lcov',
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
  }

  const sq = core.getInput('sonarqube-required');
  let sonar=sq.toLocaleLowerCase().trim();

  const st = core.getInput('SONAR_TOKEN');
  let sonar_token=st.toLocaleLowerCase().trim();

  const su = core.getInput('SONAR_HOST_URL');
  let sonar_url=su.toLocaleLowerCase().trim();

  if(sonar=="yes"){
    exec(`dotnet tool install --global dotnet-sonarscanner && dotnet sonarscanner begin /d:sonar.host.url=${sonar_url} /o:NisargShah1410 /k:finaldotnetcore /d:sonar.cs.vstest.reportsPaths=**/*.trx /d:sonar.cs.opencover.reportsPaths=**/coverage.opencover.xml /d:sonar.login=${sonar_token} && dotnet sonarscanner end /d:sonar.login=${sonar_token}`,
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
  }


  //if(covr=="codecov"){
	//covr="npm install -g @angular/cli && ng test --code-coverage";
  //}else if(covr=="coverlet"){
	//covr="dotnet test /p:CollectCoverage=true /p:CoverletOutput=TestResults/ /p:CoverletOutputFormat=lcov";
  //}
  
  //const fp = core.getInput('file-path');
  //let fpath = fp;11111111
	
  //let covsett = "/p:CollectCoverage=true /p:CoverletOutput=TestResults/ /p:CoverletOutputFormat=lcov";

 // console.log(`HERE IS THE COMMAND - ${choosenlang}!`);
  
 // core.setOutput("startupcmd", choosenlang);

  //core.setOutput("coveragetest", covr);
	
  //core.setOutput("filep", fpath);

  //core.setOutput("coverlet-settings", covsett);
  

  // const time = (new Date()).toTimeString();
 // core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
