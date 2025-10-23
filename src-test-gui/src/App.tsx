import React, { Component } from 'react';
import { type Theme, createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import {
    AppBar,
    Toolbar,
    TextField,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { type DetectOptions, type PatternControl, Types } from '@iobroker/type-detector';
import ChannelDetector from '@iobroker/type-detector';
import { Brightness1 } from '@mui/icons-material';

interface AppState {
    json: string;
    controls: PatternControl[] | null;
    themeType: 'light' | 'dark';
    theme: Theme;
    ids: string[];
    selectedId: string;
    error: string;
    objects: { [id: string]: ioBroker.Object };
    options: DetectOptions;
}

const getTheme = (mode: 'light' | 'dark'): Theme =>
    createTheme({
        palette: {
            mode,
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#9c27b0',
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
    });

const getSystemTheme = (): 'light' | 'dark' =>
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

// function getParent(id: string): string {
//     const parts = id.split('.');
//     parts.pop();
//     return parts.join('.');
// }

export default class App extends Component<object, AppState> {
    constructor(props: any) {
        super(props);

        const savedTheme = window.localStorage.getItem('themeType') as 'light' | 'dark' | null;
        const initialMode: 'light' | 'dark' =
            savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : getSystemTheme();

        const optionsStr = window.localStorage.getItem('options');
        let options: DetectOptions | null = null;
        if (optionsStr) {
            try {
                options = JSON.parse(optionsStr);
            } catch {
                // ignore
            }
        }
        options ||= {
            objects: {},
            id: '',
            ignoreIndicators: ['UNREACH_STICKY'],
            excludedTypes: [Types.info],
            detectOnlyChannel: true,
            detectAllPossibleDevices: true,
        };

        const json =
            window.localStorage.getItem('json') ||
            `{
    "shelly.0.SHDM-2#081234567896#1.lights.brightness": {
        "type": "state",
        "common": {
          "name": "Brightness",
          "type": "number",
          "role": "level.brightness",
          "read": true,
          "write": true,
          "min": 0,
          "max": 100,
          "unit": "%",
          "smartName": false
        },
        "native": {},
        "_id": "shelly.0.SHDM-2#081234567896#1.lights.brightness",
        "acl": {
          "object": 1636,
          "state": 1636,
          "owner": "system.user.admin",
          "ownerGroup": "system.group.administrator"
        },
        "from": "system.adapter.admin.0",
        "user": "system.user.admin",
        "ts": 1761135418194,
        "val": 10,
        "ack": true
      }
  }`;

        this.state = {
            json,
            ids: [],
            selectedId: window.localStorage.getItem('selectedId') || '',
            controls: null,
            themeType: initialMode,
            theme: getTheme(initialMode),
            error: '',
            objects: {},
            options,
        };
    }

    componentDidMount(): void {
        this.detectControls();
    }

    detectControls = (): void => {
        try {
            const json = JSON.parse(this.state.json);

            if (typeof json !== 'object' || json === null) {
                this.setState({ error: 'Invalid JSON object' });
                return;
            }
            let objects: { [id: string]: ioBroker.Object } = {};
            if (Array.isArray(json)) {
                objects = {};
                for (let i = 0; i < json.length; i++) {
                    const obj = json[i];
                    if (obj && typeof obj === 'object' && typeof obj._id === 'string') {
                        objects[obj._id] = obj;
                    }
                }
            } else if (json._id) {
                objects[json._id] = json;
            } else if (Object.keys(json).length === 0) {
                this.setState({ error: 'Empty JSON object' });
                return;
            } else if (Object.values(json).every(v => typeof v === 'object' && v !== null && '_id' in v)) {
                objects = json as { [id: string]: ioBroker.Object };
            } else {
                this.setState({ error: 'Invalid JSON structure' });
                return;
            }
            this.setState({ ids: Object.keys(objects), objects, error: '' }, () => {
                if (this.state.selectedId && objects[this.state.selectedId]) {
                    // If upper Device is not a channel remove detectOnlyChannel flag
                    const options: DetectOptions = JSON.parse(JSON.stringify(this.state.options));
                    // options.detectOnlyChannel =
                    //     this.state.objects[getParent(this.state.selectedId)]?.type === 'channel' ||
                    //     this.state.objects[getParent(this.state.selectedId)]?.type === 'device';

                    try {
                        const detector = new ChannelDetector();

                        options.objects = objects;
                        options.id = this.state.selectedId;

                        const controls = detector.detect(options);
                        if (controls) {
                            for (const types of controls) {
                                console.log(`Found ${types.type}`);
                            }
                        }
                        this.setState({ controls, error: '' });
                    } catch (e) {
                        this.setState({ error: e.toString() });
                        this.setState({ controls: null });
                    }
                }
            });
        } catch (e) {
            this.setState({ error: e.toString() });
            this.setState({ controls: null });
        }
    };

    toggleTheme = (): void => {
        const next = this.state.themeType === 'light' ? 'dark' : 'light';
        this.setState({ themeType: next, theme: getTheme(next) });
    };

    renderControl(control: PatternControl, index: number): React.JSX.Element {
        return (
            <div
                key={index}
                style={{ marginBottom: '1rem' }}
            >
                <div
                    style={{ background: this.state.theme.palette.primary.main, padding: '0.5rem', fontWeight: 'bold' }}
                >
                    <strong>Type:</strong> {control.type}
                </div>
                <div>
                    <Table size="small">
                        <TableHead style={{ background: this.state.theme.palette.action.hover }}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Min</TableCell>
                                <TableCell>Max</TableCell>
                                <TableCell>Read</TableCell>
                                <TableCell>Write</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {control.states
                                .filter(state => state.id)
                                .map((state, i) => {
                                    // state = {"indicator":false,"type":"number","min":"number","max":"number","write":true,"name":"SET","required":true,"defaultRole":"level","defaultUnit":"%","ignoreRole":{},"id":"shelly.0.SHDM-2#081234567896#1.lights.brightness"}
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>
                                                {state.name}
                                                {state.required ? ' *' : ''}
                                            </TableCell>
                                            <TableCell>{state.id}</TableCell>
                                            <TableCell>{state.type}</TableCell>
                                            <TableCell>{state.min?.toString() || ''}</TableCell>
                                            <TableCell>{state.max?.toString() || ''}</TableCell>
                                            <TableCell>{state.read !== false ? 'x' : '-'}</TableCell>
                                            <TableCell>{state.write ? 'x' : '-'}</TableCell>
                                            <TableCell>{state.defaultUnit || ''}</TableCell>
                                            <TableCell>{state.defaultRole || ''}</TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    render(): React.JSX.Element {
        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={this.state.theme}>
                    <div className="App">
                        <AppBar position="static">
                            <Toolbar variant="dense">
                                <div>Tester</div>
                                <div style={{ flexGrow: 1 }} />
                                <IconButton
                                    color="inherit"
                                    onClick={this.toggleTheme}
                                >
                                    <Brightness1 />
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <div
                            style={{
                                padding: '0 10px 10px 10px',
                                height: 'calc(100% - 48px)',
                                overflow: 'auto',
                                background: this.state.theme.palette.background.default,
                            }}
                        >
                            <div style={{ display: 'flex' }}>
                                <TextField
                                    label="JSON Input"
                                    multiline
                                    rows={5}
                                    variant="standard"
                                    value={this.state.json}
                                    onChange={e => {
                                        window.localStorage.setItem('json', e.target.value);
                                        this.setState({ json: e.target.value }, () => this.detectControls());
                                    }}
                                    style={{ width: '100%', marginTop: 20 }}
                                />
                                <div
                                    style={{
                                        marginLeft: 20,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                        color: this.state.theme.palette.text.primary,
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.options.detectOnlyChannel}
                                                onChange={e => {
                                                    const options = {
                                                        ...this.state.options,
                                                        detectOnlyChannel: e.target.checked,
                                                    };
                                                    window.localStorage.setItem('options', JSON.stringify(options));
                                                    this.setState({ options }, () => this.detectControls());
                                                }}
                                            />
                                        }
                                        label="Detect Only Channel"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.options.detectAllPossibleDevices}
                                                onChange={e => {
                                                    const options = {
                                                        ...this.state.options,
                                                        detectAllPossibleDevices: e.target.checked,
                                                    };
                                                    window.localStorage.setItem('options', JSON.stringify(options));
                                                    this.setState({ options }, () => this.detectControls());
                                                }}
                                            />
                                        }
                                        label="Detect All Possible Devices"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.options.detectParent}
                                                onChange={e => {
                                                    const options = {
                                                        ...this.state.options,
                                                        detectParent: e.target.checked,
                                                    };
                                                    window.localStorage.setItem('options', JSON.stringify(options));
                                                    this.setState({ options }, () => this.detectControls());
                                                }}
                                            />
                                        }
                                        label="Detect Parent"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.options.ignoreEnums}
                                                onChange={e => {
                                                    const options = {
                                                        ...this.state.options,
                                                        ignoreEnums: e.target.checked,
                                                    };
                                                    window.localStorage.setItem('options', JSON.stringify(options));
                                                    this.setState({ options }, () => this.detectControls());
                                                }}
                                            />
                                        }
                                        label="Ignore Enums"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.options.ignoreCache}
                                                onChange={e => {
                                                    const options = {
                                                        ...this.state.options,
                                                        ignoreCache: e.target.checked,
                                                    };
                                                    window.localStorage.setItem('options', JSON.stringify(options));
                                                    this.setState({ options }, () => this.detectControls());
                                                }}
                                            />
                                        }
                                        label="Ignore Cache"
                                    />
                                </div>
                            </div>
                            {this.state.ids?.length ? (
                                <FormControl
                                    fullWidth
                                    variant="standard"
                                >
                                    <InputLabel>ID</InputLabel>
                                    <Select
                                        variant="standard"
                                        value={this.state.selectedId}
                                        onChange={event => {
                                            window.localStorage.setItem('selectedId', event.target.value);
                                            this.setState({ selectedId: event.target.value }, () =>
                                                this.detectControls(),
                                            );
                                        }}
                                    >
                                        {this.state.ids.map(id => (
                                            <MenuItem
                                                key={id}
                                                value={id}
                                            >
                                                {id} (
                                                {this.state.objects[id]?.common?.role || this.state.objects[id]?.type})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : null}
                            {this.state.error ? <div style={{ color: 'red' }}>{this.state.error}</div> : null}
                            {this.state.controls?.map((control, i) => this.renderControl(control, i))}
                        </div>
                    </div>
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}
