# ioBroker device types

Fields:
- **R** - If the state is mandatory and must be in the channel/device.
- **Name** - Name describes the function of a state in a channel or in a device and is not 
  connected to the name of the ioBroker state. 
  Important is that role, enum, type, and write attribute are the same as in the table.
- **Role** - Optimal role of the state. But it could variate itself. Check the regex to be sure if the role is suitable.
- **Unit** - Desired unit. After the slash is *required unit*.
- **Type** - Required type
- **Wr** - Is the state must be writable or not. 'W' - must be writable, '-' - must be not writeable.
- **Min** - State must have min attribute.
- **Max** - State must have max attribute.
- **Enum** - State must belong to specific category
- **Ind** - Is the state is an indicator. Indicators will be shown as a small icon in material.
- **Regex** - Role regex

