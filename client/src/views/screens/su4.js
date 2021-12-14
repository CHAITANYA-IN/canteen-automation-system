import { ValidationForm, ValidationComponent } from "react-native-validator";

constructor(props, context) {
  super(props, context);
  ValidationComponent.setDefaultErrorMessageStyle({
    color: "white",
    fontSize: 12,
  });
}

render() {   
    return (
      <ValidationForm
        style={style.container}
        ref={ref => (this.form = ref)}
        onSubmit={() => this.props.saveUserList()}
        onError={() => console.log("houston we have a problem")}
      >
        <ValidationComponent
          component={
            <RkTextInput
              rkType="bordered"
              style={{ width: "100%" }}
              placeholder="List Name"
              value={name}
              onChangeText={value => this.setState({ name: value.trim() })}
            />
          }
          validators={["required", "isEmail"]}
          errorMessages={["this field is required", "email is not valid"]}
        />
        <ValidationComponent
          component={
            <TextInput
              style={{ width: "100%" }}
              placeholder="You can type a description"
              value={description}
              onChangeText={value => this.setState({ description: value })}
            />
          }
          errorMessageStyle={{
            color: "red"
          }}
          validators={["required"]}
          errorMessages={["this field is required"]}
        />
        <RkButton rkType="primary xlarge" onPress={() => this.form.validate()}>
          Next
        </RkButton>
      </ValidationForm>
    );
}
