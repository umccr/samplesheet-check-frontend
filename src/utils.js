import { fetchAuthSession } from "aws-amplify/auth";
import config from "./config.ts";

export function download({ filename, content }) {
  // parameter take a text to be downloaded
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(content),
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// As there is an issue with setting up form-data boundaries with aws-amplify API
// submitting the samplesheet check will not work so a temporary fetch function declared here
// until problem is fix
//
// Ref: https://github.com/aws-amplify/amplify-js/issues/12638

export async function sscheckFetchApi({ method, additionalHeader, body }) {
  const authToken = (await fetchAuthSession()).tokens.idToken.toString();

  return await fetch(config.apiGateway.URL, {
    method: method,
    headers: {
      authorization: authToken,
      ...additionalHeader,
    },
    body: body,
  });
}
