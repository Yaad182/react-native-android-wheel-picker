import React, { Component } from "react";
import { Text, View, ScrollView, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const iOS = Platform.OS === "ios";
const HEIGHT = 37;

export class WheelPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      yPos: 0,
      item: 0,
      value: this.props.selectedValue
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount = async () => {
    let item = await this.props.children.findIndex(
      arr => arr.props.value === this.props.selectedValue
    );

    setTimeout(() => {
      if (item && this.scrollView) {
        this.scrollView.scrollTo({
          y: HEIGHT * item,
          animated: false
        });
      }
    }, 1);

    this.setState({ itemStyle: this.props.itemStyle, item });
  };

  goToValue = () => {
    let item = this.props.children.findIndex(
      arr => arr.props.value === this.props.selectedValue
    );

    if (item) {
      setTimeout(() => {
        this.scrollView.scrollTo({
          y: HEIGHT * item,
          animated: true
        });
      }, 1);

      this.setState({ item });
    }
  };

  handleScroll = e => {
    const yPos = e.nativeEvent.contentOffset.y;
    const itemAccurate = yPos / HEIGHT;
    const item = Math.round(itemAccurate);

    if (this.props.children[item]) {
      const value = this.props.children[item].props.value;

      this.props.onValueChange && this.props.onValueChange(value);

      this.setState({ yPos, item: itemAccurate, value });
    }
  };

  render() {
    return (
      <View style={{ height: 200, width: "100%" }}>
        <View style={styles.selector} />
        {this.props.backgroundColor && (
          <LinearGradient
            colors={[
              this.props.backgroundColor,
              "transparent",
              this.props.backgroundColor
            ]}
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              zIndex: 1
            }}
            pointerEvents="none"
          />
        )}

        <ScrollView
          contentContainerStyle={styles.root}
          nestedScrollEnabled
          scrollEventThrottle={1}
          showsVerticalScrollIndicator={false}
          snapToInterval={HEIGHT}
          onScroll={this.handleScroll}
          onScrollAnimationEnd={this.goToValue}
          ref={scrollView => (this.scrollView = scrollView)}
          scrollEnabled={this.props.enabled}
        >
          <View style={styles.itemContainer}>
            {this.props.children.map((arr, index) => {
              return (
                <Text
                  key={index}
                  style={[styles.text, this.props.itemStyle]}
                  allowFontScaling={false}
                >
                  {arr.props.label}
                </Text>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export class Item extends Component {
  render() {
    return (
      <Text
        style={[styles.text, this.props.itemStyle]}
        allowFontScaling={false}
      >
        {this.props.label}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  itemContainer: {
    marginTop: 80,
    marginBottom: 80
  },
  text: {
    fontSize: 20,
    marginVertical: iOS ? 6.5 : 5,
    textAlign: "center"
  },
  selector: {
    position: "absolute",
    height: 40,
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    top: 80
  }
});
