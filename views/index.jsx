import React from 'react';
import PropTypes from 'prop-types';

export default class TodoBox extends React.Component {
  render() {
    return (
      <div className="todoBox">
        <h1>Todos</h1>
        <TodoList data={this.props.data} />
      </div>
    );
  }
}
TodoBox.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      titleValue: '',
      detailValue: '',
    };

    this.changeTitle = (e) => {
      this.setState({
        titleValue: e.target.value,
      });
    };

    this.changeDetail = (e) => {
      this.setState({
        detailValue: e.target.value,
      });
    };

    this.addTodo = () => {
      const data = this.state.data;
      data.push({
        title: this.state.titleValue,
        detail: this.state.detailValue,
      });
      this.setState({
        data,
        titleValue: '',
        detailValue: '',
      });
    };

    this.deleteTodo = (title) => {
      const data = this.state.data.filter(e => title !== e.title);
      this.setState({
        data,
      });
    };
  }
  render() {
    return (
      <div className="todoList">
        <div>
          Title:<input type="text" value={this.state.titleValue} onChange={this.changeTitle} />
          Detail:<input type="text" value={this.state.detailValue} onChange={this.changeDetail} />
          <button onClick={this.addTodo}>Add</button>
        </div>
        <table style={{ border: '2px solid black' }}>
          <tbody>
            {this.state.data.map(obj => (
              <Todo title={obj.title} key={obj.title} onDelete={this.deleteTodo}>{obj.detail}</Todo>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
TodoList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

const TodoStyle = {
  checkedTodo: {
    textDecoration: 'line-through',
  },
  notCheckedTodo: {
    textDecoration: 'none',
  },
  tableContent: {
    border: '1px solid black',
  },
};

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };

    this.handleChange = (e) => {
      this.setState({
        checked: e.target.checked,
      });
    };

    this._onDelete = () => {
      this.props.onDelete(this.props.title);
    };
  }
  render() {
    return (
      <tr style={this.state.checked ? TodoStyle.checkedTodo : TodoStyle.notCheckedTodo}>
        <td style={TodoStyle.tableContent}><button onClick={this._onDelete}>X</button></td>
        <td style={TodoStyle.tableContent}>
          <input
            type="checkbox"
            checked={this.state.checked}
            onChange={this.handleChange}
          />
        </td>
        <td style={TodoStyle.tableContent}>{this.props.title}</td>
        <td style={TodoStyle.tableContent}>{this.props.children}</td>
      </tr>
    );
  }
}
Todo.propTypes = {
  title: PropTypes.string.isRequired,
};
