import React from "react";
import Remarkable from "remarkable";

import ButtonToolbar from "react-bootstrap/lib/ButtonToolbar";
import ButtonGroup from "react-bootstrap/lib/ButtonGroup";
import Button from "react-bootstrap/lib/Button";

import ParseResult from "../models/ParseResult.jsx";

export default class ResultView extends React.Component {
  static propTypes = {
    pages: React.PropTypes.array.isRequired,
    transformations: React.PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { pages, transformations } = this.props;
    var parseResult = new ParseResult({
      pages: pages,
    });
    var lastTransformation;
    transformations.forEach((transformation) => {
      if (lastTransformation) {
        parseResult = lastTransformation.completeTransform(parseResult);
      }
      parseResult = transformation.transform(parseResult);
      lastTransformation = transformation;
    });

    var text = "";
    parseResult.pages.forEach((page) => {
      page.items.forEach((item) => {
        text += item + "\n";
      });
    });
    this.state = {
      preview: true,
      text: text,
    };
  }

  switchToPreview() {
    this.setState({
      preview: true,
    });
  }

  switchToEdit() {
    this.setState({
      preview: false,
    });
  }

  handleChange(event) {
    this.setState({
      text: event.target.value,
    });
  }

  render() {
    const remarkable = new Remarkable({
      breaks: true,
      html: true,
    });
    const { preview, text } = this.state;

    var textComponent;
    if (preview) {
      const html = remarkable.render(text);
      textComponent = <div dangerouslySetInnerHTML={{ __html: html }} />;
    } else {
      textComponent = (
        <textarea
          rows="45"
          cols="150"
          className="bg-white"
          value={text}
          onChange={this.handleChange.bind(this)}
        />
      );
    }
    return (
      <div className="flex flex-col">
        <div className="py-3 flex justify-center items-center w-full gap-4">
          <button
            onClick={this.switchToEdit.bind(this)}
            className={`px-2 py-1 rounded-md transition-colors ${
              preview ? "bg-primary-500 text-white" : "bg-stone-200 "
            }`}
            // className={!preview ? "bg-primary-500" : ""}
          >
            Edit
          </button>
          <button
            onClick={this.switchToPreview.bind(this)}
            className={`px-2 py-1 rounded-md transition-colors ${
              !preview ? "bg-primary-500 text-white" : "bg-stone-300 "
            }`}
          >
            Preview
          </button>
        </div>

        <hr />

        <div className="px-2 py-5 flex justify-center align-middle">
          {textComponent}
        </div>
      </div>
    );
  }
}
