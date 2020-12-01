/**
 * MIST is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* +-------+
 * | Notes |
 * +-------+
 * 
 * Documentation following JSDocs https://jsdoc.app/index.html
 * Currently documented are the HTTP requests made to the API from the GUI 
 * Workspace. 
 * 
 * The process to save anything from the workspace is currently 
 * proposed to be check if the name we are saving with has already been used. If so, 
 * tell the user to pick a different name, if not then save the thing, which 
 * is either an image or a workspace. 
 * 
 * The functions return a object. The API is written with inconsistent return objects,
 * so we should at some point go back and make it consistent, we could look here for 
 * inspiration: https://stackoverflow.com/questions/12806386/is-there-any-standard-for-json-api-response-format
 * 
 * +----------+
 * | Concerns |
 * +----------+
 * Currently our process in saving to the database is to first do a check. This 
 * could be a security concern since all the javascript accessible to the browser 
 * and could be manipulated. This is also a redundant HTTP request if the image does 
 * not exist. So we should and we should really wrap it into one function call.
 */
// UTILITIES
 // statusCode may be redudant information
async function handleResponseNotOk(response, reject) {
    const {data, message, status} = await response.json();
	if(reject){
		reject(data, message, status);
	} else{
    const statusCode = response.status;
    switch (status) {
        case "fail":
            console.log(`Status Code: ${statusCode}. Failed due to: `, data);
            alert(`Failed due to: \n${objectToPrettyString(data)}`);
			break;
        case "error":
            console.log(`Status Code: ${statusCode}. Failed due to: `, message);
			alert(message);
			break;
        default:
            // we do not expect to reach this case
            alert(`Unknown Status: ${status}`);
    }}
};

function objectToPrettyString(object) {
    let str = '';
    for (const property in object) {
        str = str + (`${property}: ${object[property]}\n`);
    }
    return str;
};

export async function saveImage2(imageName, imageMISTCode){
	// check if the user has already created an image with the chosen name
    const response = await fetch(`/api?action=imageExists&title=${imageName}`);
    // check if the response status code is 200
    if (response.ok) {
        const responseJSON = await response.json();
        if (responseJSON.data.exists){
		  alert(`Cannot save an image by this name because you already have an image by the name: ${imageName}`);
		} else {
			// save the image
			const saveImageResponse = await fetch('/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({action: 'saveImage', title: imageName, code: imageMISTCode})
			});
			if(saveImageResponse.ok){
				const saveImageResponseJSON = await saveImageResponse.json();
				alert(`Successfully saved the image: ${imageName}`);
			}else{
				handleResponseNotOk(saveImageResponse);
			};
		}
    } else {
        handleResponseNotOk(response);
    };
}
/** 
 * Check if the user has an image by the chosen name.
 * 
 * @async
 * @function imageExists
 * @param {string} imageName - the name of the image
 * @returns {Promise<boolean>} true if the user has an image by the chosen name,
 * false if they don't. 
 */
export async function imageExists(imageName) {
    const response = await fetch(`/api?action=imageExists&title=${imageName}`);
    // check if the response status code is 200
    if (response.ok) {
        const responseJSON = await response.json();
        return responseJSON.data.exists;
    } else {
        handleResponseNotOk(response);
    };
};

/** Save an image.
 * 
 * @async
 * @function saveImage
 * @param {string} imageName, 
 * @param {string} imageMISTCode, 
 * @returns {Promise<null>}
 */
export async function saveImage(imageName, imageMISTCode) {
    // save the image
    const response = await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({action: 'saveImage', title: imageName, code: imageMISTCode})
    });
    if(response.ok){
        const responseJSON = await response.json();
        alert('Successfully saved image.');
    }else{
        handleResponseNotOk(response);
    };
}; 

/** 
 * Check if user already has a workspace by the chosen name.
 * 
 * @param {string} workspaceName, 
 * @returns {Promise<boolean>} returns true if the user has a workspace by the chosen 
 * name; returns false if they do not.
 */
export async function workspaceExists(workspaceName, resolve, reject){
    const response = await fetch(`/api?action=workspaceExists&name=${workspaceName}`);
    if(response.ok){
        const responseJSON = await response.json();
        resolve(responseJSON.data.exists);
    }else{
        handleResponseNotOk(response, reject);
    };
};

/** 
 * Save a workspace 
 * 
 * @param {string} workspaceName,
 * @param {object} workspaceState, 
 * @returns {Promise<null>} 
 */
// API action savews
export async function saveWorkspace(workspaceName, workspaceState, resolve, reject) {
    const workspace = { name: workspaceName, data: workspaceState };
    const response = await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'saveWorkspace', workspace: workspace })
    });
    if(response.ok){
        const responseJSON = await response.json();
        resolve('Successfully saved workspace.');
    } else {
        handleResponseNotOk(response, reject);
    };
};

/** 
 * Retrieve workspaces 
 * 
 * @returns {Promise<Array>} The workspaces a user has.
 */
export async function getWorkspaces() {
    const response = await fetch('/api?action=getWorkspaces', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if(response.ok){
        const responseJSON = await response.json();
        return responseJSON.data.workspaces;
    }else{
        handleResponseNotOk(response);
    };
};

/**
 * Delete a workspace of a name
 * API action deleteWorkspace
 * @param {String} name 
 */
export async function deleteWorkspace(name, resolve){
    // async POST fetch request
    const res = await fetch('api/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'deleteWorkspace', name: name })
    });
    if (!res.ok)
        handleResponseNotOk(res);
    else {
        alert(`Successfully deleted the workspace: ${name}`);
        resolve();
    }
};