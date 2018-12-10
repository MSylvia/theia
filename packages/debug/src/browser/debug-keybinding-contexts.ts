/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { injectable, inject } from 'inversify';
import { KeybindingContext } from '@theia/core/lib/browser';
import { DebugSessionManager } from './debug-session-manager';
import { DebugState } from './debug-session';
import { DebugEditorService } from './editor/debug-editor-service';

export namespace DebugKeybindingContexts {

    export const inDebugMode = 'inDebugMode';

    export const inBreakpointWidget = 'inBreakpointWidget';

    export const inStrictBreakpointWidget = 'inStrictBreakpointWidget';

}

@injectable()
export class InDebugModeContext implements KeybindingContext {

    readonly id: string = DebugKeybindingContexts.inDebugMode;

    @inject(DebugSessionManager)
    protected readonly manager: DebugSessionManager;

    isEnabled(): boolean {
        return this.manager.state > DebugState.Inactive;
    }

}

@injectable()
export class InBreakpointWidgetContext implements KeybindingContext {

    readonly id: string = DebugKeybindingContexts.inBreakpointWidget;

    @inject(DebugEditorService)
    protected readonly editors: DebugEditorService;

    isEnabled(): boolean {
        const model = this.editors.model;
        return !!model && !!model.breakpointWidget.position && !model.editor.isFocused();
    }

}

@injectable()
export class InStrictBreakpointWidgetContext extends InBreakpointWidgetContext {

    readonly id: string = DebugKeybindingContexts.inStrictBreakpointWidget;

    isEnabled(): boolean {
        const model = this.editors.model;
        return !!model && !!model.breakpointWidget.position && (!model.editor.isFocused() || model.editor.isFocused({ strict: true }));
    }

}
