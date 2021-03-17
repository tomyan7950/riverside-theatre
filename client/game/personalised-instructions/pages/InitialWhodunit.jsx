import React, { Component } from 'react';
import Whodunit from '../../../general/whodunit/Whodunit';
import ChangePageButtons from '../../../general/buttons/ChangePageButtons'

export default class InitialWhodunit extends Component {
    componentDidMount() {
        this.props.scrollToTop();
    }

    render() {
        const { player, pageDbIndex, min } = this.props;

        return (
            <div>
                <h3>Initial Verdict</h3>

                <Whodunit player={player} whichVerdict={"initial"} />

                <div className="game-instructions">
                    <div>
                        <strong><u>Note:</u></strong> This is only your <strong>initial verdict.</strong> After the discussion phase you will provide your <strong>final verdict</strong> which might be different.
                    </div>
                </div>

                <ChangePageButtons player={player} pageDbIndex={pageDbIndex} min={min} disabledCondition={!player.get("initialWhodunit")} />

            </div>
        )
    }
}
