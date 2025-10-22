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
} from '@mui/material';
import { type DetectOptions, type PatternControl, Types } from '../../src/types';
import { ChannelDetector } from '../../src/ChannelDetector';
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

export default class App extends Component<object, AppState> {
    constructor(props: any) {
        super(props);

        const initialMode: 'light' | 'dark' = 'light';

        this.state = {
            json: window.localStorage.getItem('json') || '',
            ids: [],
            selectedId: window.localStorage.getItem('selectedId') || '',
            controls: null,
            themeType: initialMode,
            theme: getTheme(initialMode),
            error: '',
            objects: {},
            options: {
                objects: {},
                id: '',
                ignoreIndicators: ['UNREACH_STICKY'],
                excludedTypes: [Types.info],
                detectOnlyChannel: true,
                detectAllPossibleDevices: true,
            },
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
            this.setState({ ids: Object.keys(objects), objects }, () => {
                if (this.state.selectedId && objects[this.state.selectedId]) {
                    try {
                        const detector = new ChannelDetector();

                        const options: DetectOptions = JSON.parse(JSON.stringify(this.state.options));
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
                <div style={{ background: '#ccc', padding: '0.5rem', fontWeight: 'bold' }}>
                    <strong>Type:</strong> {control.type}
                </div>
                <div>
                    <Table size="small">
                        <TableHead style={{ background: '#eee' }}>
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
                                padding: 10,
                                height: 'calc(100% - 48px)',
                                overflow: 'auto',
                                background: this.state.theme.palette.background.default,
                            }}
                        >
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
