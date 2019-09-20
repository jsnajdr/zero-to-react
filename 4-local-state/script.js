// application state object
let state = {
	loading: false,
	query: '',
	results: null,
};

// UI components, mapping props (data) to UI (React elements)
function UI(props) {
	return (
		<>
			<SearchBox query={props.query} onChange={doSearch} />
			{props.loading && <LoadingPlaceholder query={props.query} />}
			{props.results && <DomainsList domains={props.results} />}
		</>
	);
}

function SearchBox(props) {
	return (
		<>
			Enter a domain name or keyword:{' '}
			<input type="text" value={props.query} onChange={props.onChange} />
		</>
	);
}

function animateDots(dots, maxCount) {
	if (dots.length === maxCount) {
		return '';
	}

	return dots + '.';
}

class LoadingPlaceholder extends React.Component {
	state = { dots: '' };

	componentDidMount() {
		this.interval = setInterval(() => {
			this.setState({
				dots: animateDots(this.state.dots, 10),
			});
		}, 200);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div>
				Searching for {this.props.query}
				{this.state.dots}
			</div>
		);
	}
}

function DomainsList(props) {
	return (
		<ul>
			{props.domains.map(domain => (
				<Domain name={domain.domain_name} cost={domain.cost} />
			))}
		</ul>
	);
}

function Domain(props) {
	return (
		<li>
			{props.name} ({props.cost})
		</li>
	);
}

// Promise sleeper helper
const sleep = ms => value => new Promise(resolve => setTimeout(() => resolve(value), ms));

// Event handlers
function doSearch(event) {
	const query = event.target.value;
	setState({ loading: true, query });

	WPCOM()
		.domains()
		.suggestions(query)
		.then(sleep(5000))
		.then(results => {
			if (state.query !== query) {
				return;
			}
			setState({ loading: false, results });
		})
		.catch(() => {
			setState({ loading: false });
		});
}

function render() {
	const container = document.querySelector('main');
	const ui = React.createElement(UI, state);
	ReactDOM.render(ui, container);
}

function setState(newState) {
	state = { ...state, ...newState };
	render();
}

// Do the initial render!
render();
