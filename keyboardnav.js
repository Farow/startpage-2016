(function () {
	'use strict';

	document.addEventListener('keydown', keydown);

	/* in order: up, left, down, right*/
	let navigation_keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];

	/* in any order */
	let open_link_keys  = ['KeyE', 'Space', 'Enter'];
	let blur_keys       = ['KeyQ', 'Escape', 'Backquote', 'Digit0'];

	/* navigation variables */
	let x = 0, y = 0;
	let state = 0; /* for numerical navigation, 0: select column, 1: select link */
	let columns, links = [ ];
	let focused_column, focused_link;

	document.addEventListener('DOMContentLoaded', init);

	function init (event) {
		columns = document.getElementsByClassName('column');

		for (let i = 0; i < columns.length; i++) {
			links[i] = columns[i].getElementsByClassName('link');
		}
	}

	function keydown (event) {
		if (navigation_keys.includes(event.code)) {
			navigate(event.code);
		}
		else if (blur_keys.includes(event.code)) {
			unblur();
		}
		else if (/Digit\d/.test(event.code)) {
			navigate_num(event.key);
		}
		else if (open_link_keys.includes(event.code)) {
			open_link(event);
		}
	}

	function navigate (key) {
		/* first keystroke */
		if (!focused_column) {
			focus_column(0);
			return;
		}

		if (key == navigation_keys[0]) {
			navigate_up();
		}
		else if (key == navigation_keys[1]) {
			navigate_left();
		}
		else if (key == navigation_keys[2]) {
			navigate_down();
		}
		else {
			navigate_right();
		}

		state = 0;
	}

	function navigate_num (key) {
		let index = parseInt(key, 10) - 1;

		if (index < 0) {
			state = 0;
			return;
		}

		if (!state) {
			if (index > columns.length - 1) {
				index = columns.length - 1;
			}

			/* disable link navigation when there's only one item */
			if (links[index].length == 1) {
				state = 1;
			}

			x = index;
			focus_column(index);
		}
		else {
			if (index > links[x].length - 1) {
				index = links[x].length - 1;
			}

			y = index;
			focus_link(index);
		}

		state = !state;
	}

	function navigate_up () {
		if (y > 0) {
			focus_link(--y);
		}
	}

	function navigate_left () {
		if (x > 0) {
			focus_column(--x);
		}
	}

	function navigate_down () {
		if (y < links[x].length - 1) {
			focus_link(++y);
		}
	}

	function navigate_right () {
		if (x < columns.length - 1) {
			focus_column(++x);
		}
	}

	function focus_column (index) {
		if (focused_column == columns[index]) {
			return;
		}

		if (focused_column) {
			focused_column.classList.remove('focused');
		}

		columns[index].classList.add('focused');
		focused_column = columns[index];

		if (y > links[index].length - 1) {
			y = links[index].length - 1;
		}

		focus_link(y);
	}

	function focus_link (index) {
		/* make sure we're not off bounds */
		let link = links[x][index];

		if (focused_link == link) {
			return;
		}

		if (focused_link) {
			focused_link.classList.remove('focused');
		}

		link.classList.add('focused');
		focused_link = link;
	}

	function unblur () {
		if (focused_link) {
			focused_link.classList.remove('focused');
			focused_link = undefined;
		}

		if (focused_column) {
			focused_column.classList.remove('focused');
			focused_column = undefined;
		}

		x = 0;
		y = 0;
	}

	function open_link (event) {
		if (focused_link) {
			if (event.ctrlKey) {
				window.open(focused_link.href);
			}
			else {
				focused_link.click()
			}

			event.preventDefault();
		}
	}
})();
