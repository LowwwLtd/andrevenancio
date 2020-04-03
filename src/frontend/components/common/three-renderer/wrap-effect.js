import { TweenMax } from 'gsap';

export class WrapEffect {
    constructor(material) {
        this.material = material;
        this.oldScrollTop = 0;
        this.velocity = 0;
    }

    update = isScrolling => {
        // update velocity
        this.scrollingContainer =
            this.scrollingContainer ||
            document.scrollingElement ||
            document.documentElement;
        this.velocity =
            (global.scrollY || this.scrollingContainer.scrollTop) -
            this.oldScrollTop;
        this.oldScrollTop =
            global.scrollY || document.documentElement.scrollTop;

        // ease the effect velocity
        if (this.effectTween) {
            this.effectTween.kill();
        }
        if (
            this.velocity !== 0 ||
            this.material.uniforms.effectVelocity.value > 0.0
        ) {
            this.effectTween = TweenMax.to(this, 0.5, {
                effectVelocity: isScrolling ? Math.abs(this.velocity) / 50 : 0,
                onUpdate: () => {
                    this.material.uniforms.effectVelocity.value = this.effectVelocity;
                },
                ease: 'Power2.easeOut',
            });
        }
    };
}
