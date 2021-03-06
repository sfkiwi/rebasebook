import _ from 'lodash'
import React, { Component } from 'react'
import { Search, Grid, Header } from 'semantic-ui-react'

const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, '$'),
}))

class ChatFriendSearch extends Component {
  
  componentWillMount() {
    this.resetComponent()
  }

  componentDidMount() {
    //this.getAllUsers();
    //console.log(this.state)
  }

  getAllUsers() {
    //var user = this.state.username;
    axios.get(`/api/search/users`)
      .then((response) => {
        let searchNames = response.data.map(function (user) {
          return {
            "title": user.first_name + ' ' + user.last_name,
            "description": user.username
          }
        });
        this.setState({
          source: searchNames
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  resetComponent = () => (
    this.setState({ 
      isLoading: false, 
      results: [], 
      value: '' 
    })
  );

  handleResultSelect = (e, { result }) => (
    this.setState({ 
      value: result.title 
    })
  );

  handleSearchChange = (e, { value }) => {

    this.setState({ 
      isLoading: true, 
      value 
    });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      })
    }, 500)
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
      <Grid>
        <Grid.Column width={8}>
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            results={results}
            value={value}
            {...this.props}
          />
        </Grid.Column>
        <Grid.Column width={8}>
          <Header>State</Header>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
          <Header>Options</Header>
          <pre>{JSON.stringify(source, null, 2)}</pre>
        </Grid.Column>
      </Grid>
    )
  }
}