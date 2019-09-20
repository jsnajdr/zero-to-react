// stream of window size data
class WindowSizeObserver {
	listeners = new Set();

	windowListener = event => {
		const size = this.current;
		this.listeners.forEach(listener => listener(size));
	};

	get current() {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
		};
	}

	subscribe(callback) {
		if (this.listeners.size === 0) {
			window.addEventListener('resize', this.windowListener);
		}
		this.listeners.add(callback);

		return () => {
			this.listeners.delete(callback);
			if (this.listeners.size === 0) {
				window.removeEventListener('resize', this.windowListener);
			}
		};
	}
}

const windowSizeObserver = new WindowSizeObserver();

// Higher order component that observes window size and passes it down as prop
function withWindowSize(InnerComponent) {
	return class extends React.Component {
		state = {
			windowSize: windowSizeObserver.current,
		};

		updateWindowSize = windowSize => {
			this.setState({ windowSize });
		};

		componentDidMount() {
			this.unsubscribe = windowSizeObserver.subscribe(this.updateWindowSize);
		}

		componentWillUnmount() {
			this.unsubscribe();
		}

		render() {
			return <InnerComponent windowSize={this.state.windowSize} {...this.props} />;
		}
	};
}

function TabList(props) {
	const threshold = props.tabs.length * 200;
	const windowWidth = props.windowSize.width;

	if (windowWidth > threshold) {
		return (
			<div className="tab-list">
				{props.tabs.map(tab => (
					<div className="tab">{tab}</div>
				))}
			</div>
		);
	} else {
		return (
			<div className="tab-list select">
				<select>
					{props.tabs.map(tab => (
						<option>{tab}</option>
					))}
				</select>
			</div>
		);
	}
}

const ResponsiveTabList = withWindowSize(TabList);

function UI() {
	return (
		<>
			<ResponsiveTabList tabs={['Posts', 'Pages', 'Comments', 'Media', 'Feedback']} />
			<ResponsiveTabList tabs={['Images', 'Documents', 'Videos', 'Audio']} />
		</>
	);
}

const container = document.querySelector('main');
ReactDOM.render(<UI />, container);
