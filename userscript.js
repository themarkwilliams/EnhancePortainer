// ==UserScript==
// @name         Portainer Items Per Page Changer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically changes the default items per page in Portainer from 10 to 50
// @author       Mark Williams
// @match        https://192.168.1.5:9443/*
// @downloadURL  https://raw.githubusercontent.com/themarkwilliams/EnhancePortainer/master/userscript.js
// @updateURL  https://raw.githubusercontent.com/themarkwilliams/EnhancePortainer/master/userscript.js
// @grant        none
// ==/UserScript==
// Relevant Issue - https://github.com/orgs/portainer/discussions/9347
// Created by Claude

(function () {
	'use strict';

	// Function to change the items per page dropdown value
	function changeItemsPerPage() {
		// Look for pagination dropdowns - they typically have "itemsPerPage" in the name or class
		const dropdowns = document.querySelectorAll('select[ng-model*="itemsPerPage"], select[data-cy*="paginationSelect"]');

		dropdowns.forEach(dropdown => {
			// Check if the dropdown exists and hasn't been modified yet
			if (dropdown && dropdown.value === "10") {
				// Set dropdown value to 50
				dropdown.value = "50";

				// Create and dispatch a change event to trigger Portainer's internal handlers
				const event = new Event('change', { bubbles: true });
				dropdown.dispatchEvent(event);

				console.log('Portainer Items Per Page changed from 10 to 50');
			}
		});
	}

	// Execute initially after a delay to ensure the page has loaded
	setTimeout(changeItemsPerPage, 1000);

	// Set up a mutation observer to detect when new content is loaded
	// This helps when navigating between different sections in Portainer
	const observer = new MutationObserver(function (mutations) {
		setTimeout(changeItemsPerPage, 500);
	});

	// Start observing once the main content area is available
	setTimeout(() => {
		const targetNode = document.querySelector('div[ui-view], div.container');
		if (targetNode) {
			observer.observe(targetNode, { childList: true, subtree: true });
		}
	}, 1500);
})();