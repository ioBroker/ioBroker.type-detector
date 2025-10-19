# ioBroker device types

**Note:** Do not copy regex with '|' from tables. It contains Unicode replacement of '|', because of Markdown's table rendering. 

Fields:
- **R** - (required) If the state is mandatory and must be in the channel/device.
- **Name** - Name describes the function of a state in a channel or in a device and is not 
  connected to the name of the ioBroker state. 
  Important is that role, enum, type, and write attribute are the same as in the table.
- **Role** - Optimal role of the state. But it could vary. Check the regex to be sure if the role is suitable.
- **Unit** - Desired unit. After the slash is a *required unit*.
- **Type** - Required type
- **Wr** - (writable) Is the state must be writable or not. 'W' - must be writable, '-' - must be not writeable.
- **Min** - State must have min attribute.
- **Max** - State must have max attribute.
- **Enum** - State must belong to a specific category
- **Ind** - Is the state is an indicator. Indicators will be shown as a small icon in material.
- **Multi** - (multiple) the state with given parameters can appear more than one time in a device. E.g., weather day 1, weather day 1, and so on.
- **Regex** - Role regex

Restrictions:
- Blinds are always opened with 100% and closed with 0%.
- Switch is always boolean and so can have only `true` and `false` values. Not `0 / 1` or `ON / OFF`.

What is not important for detection:
- Name - name of functionality in the device 
- noSubscribe - says to `material` adapter, that there is no need to monitor its value. E.g., it is button. 
- inverted - says to material, that indicator must be shown only if the value is `false`.
- defaultStates - Used for `devices` to set the default `common.states`.
- defaultRole - Used for `devices` to set the `common.role` by creation.
- defaultUnit - Used for `devices` to set the `common.unit` by creation.
- defaultType - Used for `devices` to set the `common.type` by creation.
