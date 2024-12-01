import { Input } from '@mantine/core';
import React, { Component, CSSProperties, ChangeEvent } from 'react';

// Define the prop types for the AutosizeInput component
interface AutosizeInputProps {
  className?: string; // className for the outer element
  defaultValue?: any; // default field value
  extraWidth?: number | string; // additional width for the input element
  id?: string; // id for the input, for consistent snapshots
  injectStyles?: boolean; // inject the custom stylesheet to hide clear UI, defaults to true
  inputClassName?: string; // className for the input element
  inputRef?: (input: HTMLInputElement | null) => void; // ref callback for the input element
  inputStyle?: CSSProperties; // CSS styles for the input element
  minWidth?: number | string; // minimum width for input element
  onAutosize?: (newWidth: number) => void; // onAutosize handler: function(newWidth) {}
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void; // onChange handler
  onBlur?: () => void; // onBlur handler
  onFocus?: () => void
  placeholder?: string; // placeholder text
  placeholderIsMinWidth?: boolean; // don't collapse size to less than the placeholder
  style?: CSSProperties; // CSS styles for the outer element
  value?: any; // field value
}

interface AutosizeInputState {
  inputWidth: number;
  inputId?: string;
  prevId?: string;
}

const sizerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  height: 0,
  overflow: 'scroll',
  whiteSpace: 'pre',
};

const INPUT_PROPS_BLACKLIST: (keyof AutosizeInputProps)[] = [
  'extraWidth',
  'injectStyles',
  'inputClassName',
  'inputRef',
  'inputStyle',
  'minWidth',
  'onAutosize',
  'placeholderIsMinWidth',
];

const cleanInputProps = (inputProps: AutosizeInputProps) => {
  INPUT_PROPS_BLACKLIST.forEach(field => delete inputProps[field]);
  return inputProps;
};

const copyStyles = (styles: CSSStyleDeclaration, node: HTMLElement) => {
  node.style.fontSize = styles.fontSize;
  node.style.fontFamily = styles.fontFamily;
  node.style.fontWeight = styles.fontWeight;
  node.style.fontStyle = styles.fontStyle;
  node.style.letterSpacing = styles.letterSpacing;
  node.style.textTransform = styles.textTransform;
};

const isIE =
  typeof window !== 'undefined' &&
  window.navigator &&
  /MSIE |Trident\/|Edge\//.test(window.navigator.userAgent);

const generateId = (): string | undefined => {
  return isIE ? '_' + Math.random().toString(36).substr(2, 12) : undefined;
};

export class AutosizeInput extends Component<AutosizeInputProps, AutosizeInputState> {
  static defaultProps: Partial<AutosizeInputProps> = {
    minWidth: 1,
    injectStyles: true,
  };

  input: HTMLInputElement | null = null;
  sizer: HTMLElement | null = null;
  placeHolderSizer: HTMLElement | null = null;
  mounted = false;

  static getDerivedStateFromProps(
    props: AutosizeInputProps,
    state: AutosizeInputState
  ): Partial<AutosizeInputState> | null {
    const { id } = props;
    return id !== state.prevId ? { inputId: id || generateId(), prevId: id } : null;
  }

  constructor(props: AutosizeInputProps) {
    super(props);
    this.state = {
      inputWidth: props.minWidth as number,
      inputId: props.id || generateId(),
      prevId: props.id,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.copyInputStyles();
    this.updateInputWidth();
  }

  componentDidUpdate(prevProps: AutosizeInputProps, prevState: AutosizeInputState) {
    if (prevState.inputWidth !== this.state.inputWidth) {
      if (typeof this.props.onAutosize === 'function') {
        this.props.onAutosize(this.state.inputWidth);
      }
    }
    this.updateInputWidth();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  inputRef = (el: HTMLInputElement | null) => {
    this.input = el;
    if (typeof this.props.inputRef === 'function') {
      this.props.inputRef(el);
    }
  };

  placeHolderSizerRef = (el: HTMLElement | null) => {
    this.placeHolderSizer = el;
  };

  sizerRef = (el: HTMLElement | null) => {
    this.sizer = el;
  };

  copyInputStyles() {
    if (!this.mounted || !window.getComputedStyle || !this.input) {
      return;
    }
    const inputStyles = window.getComputedStyle(this.input);
    if (!inputStyles || !this.sizer) {
      return;
    }
    copyStyles(inputStyles, this.sizer);
    if (this.placeHolderSizer) {
      copyStyles(inputStyles, this.placeHolderSizer);
    }
  }

  updateInputWidth() {
    if (
      !this.mounted ||
      !this.sizer ||
      typeof this.sizer.scrollWidth === 'undefined'
    ) {
      return;
    }
    let newInputWidth: number;
    const { placeholder, value, placeholderIsMinWidth } = this.props;

    if (placeholder && (!value || (value && placeholderIsMinWidth))) {
      newInputWidth =
        Math.max(
          this.sizer.scrollWidth,
          this.placeHolderSizer?.scrollWidth || 0
        ) + 2;
    } else {
      newInputWidth = this.sizer.scrollWidth + 2;
    }

    const extraWidth = parseInt(this.props.extraWidth as string) || 0;
    newInputWidth += extraWidth;

    if (newInputWidth < (this.props.minWidth as number)) {
      newInputWidth = this.props.minWidth as number;
    }

    if (newInputWidth !== this.state.inputWidth) {
      this.setState({
        inputWidth: newInputWidth,
      });
    }
  }

  renderStyles() {
    const { injectStyles } = this.props;
    return isIE && injectStyles ? (
      <style
        dangerouslySetInnerHTML={{
          __html: `input#${this.state.inputId}::-ms-clear {display: none;}`,
        }}
      />
    ) : null;
  }

  render() {
    const sizerValue = [this.props.defaultValue, this.props.value, ''].find(
      value => value != null
    );

    const wrapperStyle = { ...this.props.style };
    if (!wrapperStyle.display) wrapperStyle.display = 'inline-block';

    const inputStyle: CSSProperties = {
      boxSizing: 'content-box',
      border: 'none',
      width: `${this.state.inputWidth}px`,
      ...this.props.inputStyle,
    };

    const inputProps = { ...this.props };
    cleanInputProps(inputProps);
    inputProps.className = this.props.inputClassName;
    inputProps.id = this.state.inputId;
    inputProps.style = inputStyle;

    return (
      <div className={this.props.className} style={wrapperStyle}>
        {this.renderStyles()}
        <Input variant="unstyled" {...(inputProps as any)} ref={this.inputRef} />
        <div ref={this.sizerRef} style={sizerStyle}>{sizerValue}</div>
        {this.props.placeholder ? (
          <div ref={this.placeHolderSizerRef} style={sizerStyle}>
            {this.props.placeholder}
          </div>
        ) : null}
      </div>
    );
  }
}
