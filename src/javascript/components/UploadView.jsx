import React from "react";

import Alert from "react-bootstrap/lib/Alert";
import Dropzone from "react-dropzone";
import FaCloudUpload from "react-icons/lib/fa/cloud-upload";

export default class UploadView extends React.Component {
  static propTypes = {
    uploadPdfFunction: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      uploadPdfFunction: props.uploadPdfFunction,
    };
  }

  onDrop(files) {
    if (files.length > 1) {
      alert(`Maximum one file allowed to upload, but not ${files.length}!`);
      return;
    }
    const reader = new FileReader();
    const uploadFunction = this.state.uploadPdfFunction;
    reader.onload = (evt) => {
      const fileBuffer = evt.target.result;
      uploadFunction(new Uint8Array(fileBuffer));
    };
    reader.readAsArrayBuffer(files[0]);
  }

  render() {
    return (
      <div className="flex w-full h-full justify-center items-center p-4">
        <div className="w-full max-w-6xl p-8">
          <Dropzone
            onDrop={this.onDrop.bind(this)}
            multiple={false}
            className="flex w-full justify-center items-center flex-col cursor-pointer border border-gray-300 border-dashed rounded-2xl bg-gray-50 py-10 px-5 mb-5"
          >
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <FaCloudUpload
                  style={{
                    color: "#666",
                    width: 50,
                    height: 50,
                  }}
                />
              </div>
              <h2 className="text-gray-600 text-2xl font-medium">
                Drop your PDF file here
              </h2>
              <p className="text-blue-500 mt-2 cursor-pointer text-lg">
                or browse files
              </p>
            </div>
          </Dropzone>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <p className="text-yellow-800 text-lg leading-relaxed">
              This tool converts a PDF file into a Markdown text format! Simply
              drag & drop your PDF file on the upload area and go from there.
              Don't expect wonders, there are a lot of variances in generated
              PDF's from different tools and different ages. No matter how good
              the parser works for your PDF, you will have to invest a good
              amount of manual work to complete it. Though this tool aims to be
              general purpose, it has been tested on a certain set of PDF's
              only.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
