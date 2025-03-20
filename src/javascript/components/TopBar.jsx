import React from "react";

import Navbar from "react-bootstrap/lib/Navbar";
import Nav from "react-bootstrap/lib/Nav";
import NavItem from "react-bootstrap/lib/NavItem";
import MenuItem from "react-bootstrap/lib/MenuItem";
import Dropdown from "react-bootstrap/lib/Dropdown";
import Popover from "react-bootstrap/lib/Popover";
import OverlayTrigger from "react-bootstrap/lib/OverlayTrigger";

import AppLogo from "./AppLogo.jsx";
import { View } from "../models/AppState.jsx";

export default class TopBar extends React.Component {
  static propTypes = {
    mainView: React.PropTypes.object.isRequired,
    switchMainViewFunction: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired,
  };

  render() {
    const { mainView, switchMainViewFunction, title } = this.props;
    const aboutPopover = (
      <Popover
        id="popover-trigger-click-root-close"
        title={`关于 PDF to Markdown 转换器 - ${process.env.version}`}
      >
        <p className="text-gray-700 text-sm">
          <i>PDF to Markdown 转换器</i> 将您上传的PDF转换为Markdown格式。
        </p>
      </Popover>
    );

    const showTabs = mainView == View.RESULT || mainView == View.DEBUG;

    return (
      <div className="bg-transparent  text-center shadow-md h-16 flex">
        <div className="mx-auto flex justify-between">
          <div className="flex items-center w-full gap-4">
            PDF To Markdown Converter
            {showTabs && (
              <div className="flex gap-5">
                {/* <button
                  onClick={() => switchMainViewFunction(View.DEBUG)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    mainView == View.DEBUG
                      ? "bg-primary-500 text-white"
                      : "bg-stone-200 hover:bg-stone-600"
                  }`}
                >
                  debug view
                </button> */}
                <button
                  onClick={() => switchMainViewFunction(View.RESULT)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    mainView == View.RESULT
                      ? "bg-primary-500 text-white"
                      : "bg-stone-500 hover:bg-stone-600"
                  }`}
                >
                  result view
                </button>
              </div>
            )}
            <div className="ml-4 text-primary-300 font-medium">{title}</div>
          </div>
        </div>
      </div>
    );
  }
}
